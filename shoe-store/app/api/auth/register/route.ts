import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json()

  // Простая валидация
  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email и пароль обязательны' },
      { status: 400 }
    )
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: 'Пароль должен быть не короче 6 символов' },
      { status: 400 }
    )
  }

  // Проверяем, нет ли уже такого email
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json(
      { error: 'Пользователь с таким email уже существует' },
      { status: 409 }
    )
  }

  // Хэшируем пароль (10 — "стоимость" хэширования, чем больше, тем медленнее и надёжнее)
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  })

  // Сразу выдаём токен, чтобы пользователь не логинился отдельно после регистрации
  const token = signToken({ userId: user.id, role: user.role })

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
  })

  // Кладём токен в httpOnly cookie — так его не украдёт вредоносный JS-скрипт на странице
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 дней в секундах
    path: '/',
  })

  return response
}