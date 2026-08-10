import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { offerText, lang } = await req.json()
  if (!lang) return NextResponse.json({ error: 'lang requis' }, { status: 400 })

  // Fetch profile with experiences and educations
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

  const profileSummary = [
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
    ? `You are a professional CV writer. Generate a clean, structured CV in English. Use plain text with section headers in UPPERCASE. Never invent experience or skills not in the profile. Output only the CV content.`
    : `Tu es un rédacteur de CV professionnel. Génère un CV clair et structuré en français. Utilise du texte brut avec les titres de section en MAJUSCULES. N'invente jamais d'expérience ou de compétences absentes du profil. Retourne uniquement le contenu du CV.`

  const userPrompt = hasOffer
    ? (isEn
        ? `Here is the candidate's profile:\n\n${profileSummary}\n\n---\n\nHere is the job offer:\n\n${offerText}\n\n---\n\nGenerate a CV tailored to this job offer. Highlight the most relevant skills and experiences. Adjust the profile summary to match the offer's keywords. Keep all facts true to the profile.`
        : `Voici le profil du candidat :\n\n${profileSummary}\n\n---\n\nVoici l'offre d'emploi :\n\n${offerText}\n\n---\n\nGénère un CV adapté à cette offre. Mets en valeur les compétences et expériences les plus pertinentes. Ajuste le profil pour correspondre aux mots-clés de l'offre. Reste fidèle aux faits du profil.`)
    : (isEn
        ? `Here is the candidate's profile:\n\n${profileSummary}\n\n---\n\nGenerate a professional CV from this profile. Format it cleanly with UPPERCASE section headers.`
        : `Voici le profil du candidat :\n\n${profileSummary}\n\n---\n\nGénère un CV professionnel à partir de ce profil. Formate-le proprement avec des titres de section en MAJUSCULES.`)

  const message = await client.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 1200,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  })

  const cvText = message.content[0].type === 'text' ? message.content[0].text : ''

  return NextResponse.json({ cv: cvText })
}
