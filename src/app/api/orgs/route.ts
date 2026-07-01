import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const country = searchParams.get('country') ?? ''

  const organisations = await prisma.organisation.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      ...(country ? { country } : {}),
    },
    select: { id: true, name: true, slug: true, type: true, sector: true, city: true, country: true, logoColor: true, verified: true },
    take: 50,
  })

  return NextResponse.json(organisations)
}
