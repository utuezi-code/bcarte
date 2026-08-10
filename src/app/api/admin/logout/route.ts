import { NextResponse } from 'next/server'
import { deleteAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST() {
  await deleteAdminSession()
  return NextResponse.json({ ok: true })
}
