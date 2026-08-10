import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (!key || key !== process.env.ADMIN_SETUP_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const report: Record<string, unknown> = {}

  // 1. Check cookie
  const cookieStore = await cookies()
  const token = cookieStore.get('bcarte_admin')?.value
  report.cookie_present = !!token
  report.cookie_length  = token?.length ?? 0

  // 2. Check admins table columns
  try {
    const { data: cols, error: colErr } = await supabaseAdmin
      .rpc('get_table_columns', { p_table: 'admins' })
    if (colErr) {
      // fallback: select from admins directly
      const { data: row, error: rowErr } = await supabaseAdmin
        .from('admins')
        .select('id, email, sessionToken, sessionExpiry')
        .limit(1)
        .single()
      report.admins_select_error = rowErr?.message ?? null
      report.admins_row          = row ? { id: row.id, email: row.email, hasToken: !!row.sessionToken, expiry: row.sessionExpiry } : null
    } else {
      report.admins_columns = cols
    }
  } catch (e) {
    report.admins_check_error = e instanceof Error ? e.message : String(e)
  }

  // 3. If token present, try to look it up
  if (token) {
    const { data, error } = await supabaseAdmin
      .from('admins')
      .select('id, email, name, sessionExpiry')
      .eq('sessionToken', token)
      .single()
    report.token_lookup_error  = error?.message ?? null
    report.token_lookup_result = data ? { id: data.id, email: data.email, expiry: data.sessionExpiry } : null
  }

  return NextResponse.json(report)
}
