import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function getOrgId(userId: string) {
  const org = await prisma.organisation.findUnique({ where: { ownerId: userId }, select: { id: true } })
  return org?.id ?? null
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json([], { status: 401 })

  const orgId = await getOrgId(session.userId)
  if (!orgId) return NextResponse.json([])

  const offers = await prisma.jobOffer.findMany({
    where: { organisationId: orgId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(offers)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const orgId = await getOrgId(session.userId)
  if (!orgId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const { title, location, type, description, salary } = await req.json()

  const offer = await prisma.jobOffer.create({
    data: {
      organisationId: orgId,
      title,
      location,
      type: type ?? 'CDI',
      description,
      salary,
      isActive: true,
    },
  })

  return NextResponse.json(offer)
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { id } = await req.json()
  await prisma.jobOffer.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
