import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  const EXT_MAP: Record<string, string> = {
    'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/svg+xml': 'svg',
  }
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: 'Format invalide (jpg, png, webp, svg)' }, { status: 400 })
  if (file.size > 3 * 1024 * 1024)
    return NextResponse.json({ error: 'Fichier trop lourd (max 3 Mo)' }, { status: 400 })

  const ext    = EXT_MAP[file.type] ?? 'png'
  const path   = `logos/${session.userId}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabaseAdmin.storage
    .from('profiles')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (uploadError) {
    console.error('upload-logo error:', uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabaseAdmin.storage.from('profiles').getPublicUrl(path)
  return NextResponse.json({ url: `${publicUrl}?t=${Date.now()}` })
}
