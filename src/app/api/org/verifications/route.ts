import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json([], { status: 401 })

  const org = await prisma.organisation.findUnique({
    where: { ownerId: session.userId },
    select: { id: true },
  })

  if (!org) return NextResponse.json([])

  const verifications = await prisma.verification.findMany({
    where: { organisationId: org.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(verifications)
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { id, status } = await req.json()

  await prisma.verification.update({ where: { id }, data: { status } })

  return NextResponse.json({ ok: true })
}
