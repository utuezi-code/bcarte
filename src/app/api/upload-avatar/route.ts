import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const ALLOWED_EXTS  = ['jpg', 'jpeg', 'png', 'webp', 'gif']
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'Format invalide (jpg, png, webp, gif uniquement)' }, { status: 400 })
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Fichier trop lourd (max 5 Mo)' }, { status: 400 })

  const rawExt = file.name.split('.').pop()?.toLowerCase() ?? ''
  const ext    = ALLOWED_EXTS.includes(rawExt) ? rawExt : 'jpg'
  const path   = `avatars/${session.userId}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabaseAdmin.storage
    .from('profiles')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (uploadError) {
    console.error('upload error:', uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabaseAdmin.storage.from('profiles').getPublicUrl(path)

  const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`

  const { error: dbError } = await supabaseAdmin
    .from('profiles')
    .update({ avatarUrl: urlWithCacheBust })
    .eq('userId', session.userId)

  if (dbError) {
    console.error('db update error:', dbError)
    return NextResponse.json({ error: `DB update failed: ${dbError.message}`, url: urlWithCacheBust }, { status: 500 })
  }

  return NextResponse.json({ url: urlWithCacheBust })
}
