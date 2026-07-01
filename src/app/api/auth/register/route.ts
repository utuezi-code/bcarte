import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password, role, fullName, name, slug } = await req.json()

  if (!email || !password || !role) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (existing) {
    return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 })
  }

  const hash = await bcrypt.hash(password, 12)
  const dbRole = role === 'organisation' ? 'ORGANISATION' : 'PROFESSIONNEL'

  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      role: dbRole,
      ...(dbRole === 'PROFESSIONNEL'
        ? { profile: { create: { fullName: fullName ?? email.split('@')[0] } } }
        : {
            organisation: {
              create: {
                slug: slug ?? name?.toLowerCase().replace(/\s+/g, '-') ?? crypto.randomUUID(),
                name: name ?? email.split('@')[0],
              },
            },
          }),
    },
  })

  await createSession({ userId: user.id, role: dbRole })

  return NextResponse.json({ ok: true, role: dbRole })
}
