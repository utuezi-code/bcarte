import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const country = searchParams.get('country') ?? ''

  const profiles = await prisma.profile.findMany({
    where: {
      isPublic: true,
      ...(country ? { country } : {}),
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { title: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    select: { id: true, fullName: true, title: true, city: true, country: true, avatarUrl: true, isPublic: true },
    take: 50,
  })

  return NextResponse.json(profiles)
}
