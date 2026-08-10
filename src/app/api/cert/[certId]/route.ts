import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(_: NextRequest, { params }: { params: { certId: string } }) {
  const { data, error } = await supabaseAdmin
    .from('verifications')
    .select(`
      certId, certIssuedAt, type, label, refId, status,
      organisation:organisations(name, logoColor, logoUrl, verified, city, country),
      profile:profiles(fullName, title, slug, avatarUrl)
    `)
    .eq('certId', params.certId)
    .eq('status', 'CONFIRMEE')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Certificat introuvable' }, { status: 404 })
  }

  let item = null
  if (data.refId) {
    if (data.type === 'EXPÉRIENCE') {
      const { data: exp } = await supabaseAdmin
        .from('experiences').select('title, company, city, startDate, endDate, isCurrent')
        .eq('id', data.refId).single()
      item = exp
    } else {
      const { data: edu } = await supabaseAdmin
        .from('educations').select('degree, field, startYear, endYear, isCurrent, organisation:organisations(name)')
        .eq('id', data.refId).single()
      item = edu
    }
  }

  return NextResponse.json({ ...data, item })
}
