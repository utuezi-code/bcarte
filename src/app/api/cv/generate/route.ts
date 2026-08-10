import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// Configure via Vercel env vars:
//   OLLAMA_BASE_URL  = https://your-ollama-server.com  (no trailing slash)
//   OLLAMA_MODEL     = llama3, mistral, etc.
const OLLAMA_BASE  = process.env.OLLAMA_BASE_URL
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  if (!OLLAMA_BASE) {
    return NextResponse.json(
      { error: 'Serveur IA non configuré. Ajoute OLLAMA_BASE_URL dans les variables d\'environnement.' },
      { status: 503 },
    )
  }

  const { offerText, lang } = await req.json()
  if (!lang) return NextResponse.json({ error: 'lang requis' }, { status: 400 })

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('userId', session.userId)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

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
    ? 'You are a professional CV writer. Output only the CV content in plain text with UPPERCASE section headers. Never invent facts.'
    : 'Tu es un rédacteur de CV professionnel. Retourne uniquement le contenu du CV en texte brut avec les titres en MAJUSCULES. Ne fabrique aucune information.'

  const userPrompt = hasOffer
    ? (isEn
        ? `Profile:\n${profileBlock}\n\nJob offer:\n${offerText}\n\nWrite a CV tailored to this job offer. Highlight relevant skills and experiences. Adjust the summary to match the offer keywords. Stay true to the profile.`
        : `Profil :\n${profileBlock}\n\nOffre d'emploi :\n${offerText}\n\nRédige un CV adapté à cette offre. Mets en valeur les compétences et expériences pertinentes. Adapte le profil aux mots-clés de l'offre. Reste fidèle aux informations du profil.`)
    : (isEn
        ? `Profile:\n${profileBlock}\n\nWrite a clean professional CV from this profile.`
        : `Profil :\n${profileBlock}\n\nRédige un CV professionnel et propre à partir de ce profil.`)

  // Ollama OpenAI-compatible endpoint
  const response = await fetch(`${OLLAMA_BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      stream: false,
      temperature: 0.4,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('[cv/generate] Ollama error:', err)
    return NextResponse.json({ error: 'Erreur du serveur IA' }, { status: 502 })
  }

  const json = await response.json()
  const cvText: string = json.choices?.[0]?.message?.content ?? ''

  return NextResponse.json({ cv: cvText })
}
