import { NextResponse } from 'next/server'
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

  const members = await prisma.teamMember.findMany({
    where: { organisationId: org.id },
    include: { profile: { select: { fullName: true, title: true, city: true, avatarUrl: true } } },
  })

  return NextResponse.json(members)
}
