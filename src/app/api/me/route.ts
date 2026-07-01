import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  if (session.role === 'PROFESSIONNEL') {
    const [profile, user] = await Promise.all([
      prisma.profile.findUnique({
        where: { userId: session.userId },
        select: { fullName: true, title: true, city: true },
      }),
      prisma.user.findUnique({ where: { id: session.userId }, select: { email: true } }),
    ])

    return NextResponse.json({
      role: 'professionnel',
      name: profile?.fullName ?? 'Utilisateur',
      email: user?.email ?? '',
    })
  } else {
    const [org, user] = await Promise.all([
      prisma.organisation.findUnique({
        where: { ownerId: session.userId },
        select: { name: true, slug: true },
      }),
      prisma.user.findUnique({ where: { id: session.userId }, select: { email: true } }),
    ])

    return NextResponse.json({
      role: 'organisation',
      name: org?.name ?? 'Organisation',
      email: user?.email ?? '',
    })
  }
}
