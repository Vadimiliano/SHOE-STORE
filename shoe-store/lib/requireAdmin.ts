// lib/requireAdmin.ts
// Проверяет, что текущий пользователь — админ. Если нет, кидает редирект/ошибку.

import { getCurrentUser } from '@/lib/getCurrentUser'
import { redirect } from 'next/navigation'

// Для использования в Server Components (страницах)
export async function requireAdminPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    redirect('/') // не админ — отправляем на главную
  }
  return user
}

// Для использования в API-роутах (там redirect не подходит, нужен просто null/ошибка)
export async function requireAdminApi() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return null
  }
  return user
}