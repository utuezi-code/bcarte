import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const org = await prisma.organisation.findUnique({ where: { ownerId: session.userId } })

  return NextResponse.json(org)
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { name, description, sector, city, country, website } = await req.json()

  await prisma.organisation.update({
    where: { ownerId: session.userId },
    data: { name, description, sector, city, country, website },
  })

  return NextResponse.json({ ok: true })
}
