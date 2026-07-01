import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { userId: session.userId } })

  const [experiences, educations] = profile
    ? await Promise.all([
        prisma.experience.findMany({
          where: { profileId: profile.id },
          orderBy: { startDate: 'desc' },
        }),
        prisma.education.findMany({
          where: { profileId: profile.id },
          include: { organisation: { select: { name: true, slug: true } } },
        }),
      ])
    : [[], []]

  return NextResponse.json({
    ...profile,
    experiences,
    educations,
  })
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { fullName, title, city, country, bio, phone, linkedin } = await req.json()

  await prisma.profile.upsert({
    where: { userId: session.userId },
    update: { fullName, title, city, country, bio, phone, linkedin },
    create: { userId: session.userId, fullName, title, city, country, bio, phone, linkedin },
  })

  return NextResponse.json({ ok: true })
}
