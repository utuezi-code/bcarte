import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })

  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Format invalide' }, { status: 400 })
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Fichier trop lourd (max 5 Mo)' }, { status: 400 })

  const ext    = file.name.split('.').pop() ?? 'jpg'
  const path   = `avatars/${session.userId}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const supabase = getSupabaseAdmin()

  const { error: uploadError } = await supabase.storage
    .from('profiles')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (uploadError) {
    console.error('upload error:', uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(path)

  /* save avatarUrl on profile */
  await supabase.from('profiles').update({ avatarUrl: publicUrl }).eq('userId', session.userId)

  return NextResponse.json({ url: publicUrl })
}
