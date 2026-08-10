import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getOrgAccess } from '@/lib/org-auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const access = await getOrgAccess(session.userId)
  if (!access) return NextResponse.json({ error: 'Organisation introuvable' }, { status: 403 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })

  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Format invalide' }, { status: 400 })
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Fichier trop lourd (max 5 Mo)' }, { status: 400 })

  const ext    = file.name.split('.').pop() ?? 'png'
  const path   = `logos/${access.orgId}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabaseAdmin.storage
    .from('profiles')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = supabaseAdmin.storage.from('profiles').getPublicUrl(path)
  const logoUrl = `${publicUrl}?t=${Date.now()}`

  await supabaseAdmin
    .from('organisations')
    .update({ logoUrl, updatedAt: new Date().toISOString() })
    .eq('id', access.orgId)

  return NextResponse.json({ url: logoUrl })
}
