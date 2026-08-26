import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const user = await prisma.user.findUnique({ where: { email } })

  // Намеренно одинаковое сообщение об ошибке и для "нет такого email",
  // и для "неверный пароль" — так злоумышленник не узнает, существует ли email в базе
  if (!user) {
    return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
  }

  const passwordMatches = await bcrypt.compare(password, user.password)
  if (!passwordMatches) {
    return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
  }

  const token = signToken({ userId: user.id, role: user.role })

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  })

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return response
}