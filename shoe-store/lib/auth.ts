import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export type TokenPayload = {
  userId: string
  role: string
}

// Создаёт токен на основе id и роли пользователя, живёт 7 дней
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Проверяет токен и возвращает данные пользователя, либо null если токен невалиден
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}