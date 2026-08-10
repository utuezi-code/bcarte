import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

const OLLAMA_BASE  = process.env.OLLAMA_BASE_URL
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })

  if (!OLLAMA_BASE) {
    return new Response(
      JSON.stringify({ error: "Serveur IA non configuré. Ajoute OLLAMA_BASE_URL dans les variables d'environnement." }),
      { status: 503 },
    )
  }

  const { offerText, lang } = await req.json()
  if (!lang) return new Response(JSON.stringify({ error: 'lang requis' }), { status: 400 })

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('userId', session.userId)
    .single()

  if (!profile) return new Response(JSON.stringify({ error: 'Profil introuvable' }), { status: 404 })

  const { data: experiences } = await supabaseAdmin
    .from('experiences')
    .select('*')
    .eq('profileId', profile.id)
    .order('startDate', { ascending: false })

  const { data: educations } = await supabaseAdmin
    .from('educations')
    .select('*, organisation:organisations(name)')
    .eq('profileId', profile.id)

  const isEn = lang === 'en'

  const profileBlock = [
    `Nom : ${profile.fullName ?? ''}`,
    `Titre : ${profile.title ?? ''}`,
    `Localisation : ${[profile.city, profile.country].filter(Boolean).join(', ')}`,
    `Contact : ${[profile.phone, profile.linkedin, profile.emailPro].filter(Boolean).join(' | ')}`,
    `Bio : ${profile.bio ?? ''}`,
    `Compétences : ${(profile.skills ?? []).join(', ')}`,
    '',
    'Expériences :',
    ...(experiences ?? []).map((e: any) =>
      `- ${e.title} chez ${e.company}${e.city ? ` (${e.city})` : ''}, ${e.startDate ?? ''} → ${e.isCurrent ? 'Présent' : (e.endDate ?? '')}`
    ),
    '',
    'Formations :',
    ...(educations ?? []).map((e: any) =>
      `- ${e.degree}${e.field ? ` en ${e.field}` : ''}, ${e.organisation?.name ?? ''}, ${e.startYear ?? ''} → ${e.isCurrent ? 'Présent' : (e.endYear ?? '')}`
    ),
  ].join('\n')

  const hasOffer = offerText?.trim().length > 0

  const systemPrompt = isEn
    ? 'You are a professional CV writer. Output only the CV content in plain text with UPPERCASE section headers. Never invent facts. Be concise.'
    : 'Tu es un rédacteur de CV professionnel. Retourne uniquement le contenu du CV en texte brut avec les titres en MAJUSCULES. Ne fabrique aucune information. Sois concis.'

  const userPrompt = hasOffer
    ? (isEn
        ? `Profile:\n${profileBlock}\n\nJob offer:\n${offerText}\n\nWrite a CV tailored to this job offer. Highlight relevant skills and experiences. Stay true to the profile.`
        : `Profil :\n${profileBlock}\n\nOffre d'emploi :\n${offerText}\n\nRédige un CV adapté à cette offre. Mets en valeur les compétences pertinentes. Reste fidèle aux informations du profil.`)
    : (isEn
        ? `Profile:\n${profileBlock}\n\nWrite a clean professional CV.`
        : `Profil :\n${profileBlock}\n\nRédige un CV professionnel et propre.`)

  // Stream from Ollama → client
  const ollamaRes = await fetch(`${OLLAMA_BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      stream: true,
      temperature: 0.4,
      max_tokens: 1000,
    }),
  })

  if (!ollamaRes.ok) {
    const err = await ollamaRes.text()
    console.error('[cv/generate] Ollama error:', err)
    return new Response(JSON.stringify({ error: 'Erreur du serveur IA' }), { status: 502 })
  }

  // Transform OpenAI-compatible SSE stream → plain text stream
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const reader = ollamaRes.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue
          try {
            const json = JSON.parse(data)
            const token = json.choices?.[0]?.delta?.content
            if (token) controller.enqueue(encoder.encode(token))
          } catch { /* skip malformed chunks */ }
        }
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
    },
  })
}
