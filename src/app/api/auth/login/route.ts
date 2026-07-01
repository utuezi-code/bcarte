import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, password: true, role: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 })
  }

  await createSession({ userId: user.id, role: user.role })

  return NextResponse.json({ ok: true, role: user.role })
}
