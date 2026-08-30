// components/HeaderNav.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

type Props = {
  user: { name: string | null; email: string; role: string } | null
}

export default function HeaderNav({ user }: Props) {
  const { totalItems } = useCart()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh() // пересчитает Header заново на сервере — увидит, что пользователя больше нет
  }

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          shoe-store
        </Link>

        <nav className="flex items-center gap-5 text-sm text-gray-600">
          {user?.role === 'ADMIN' && (
            <Link href="/admin/products" className="hover:text-gray-900">
              Админ-панель
            </Link>
          )}

          <Link href="/orders" className="hover:text-gray-900">Мои заказы</Link>

          <Link href="/cart" className="relative hover:text-gray-900">
            Корзина
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <span className="text-gray-400">{user.name ?? user.email}</span>
              <button onClick={handleLogout} className="hover:text-gray-900">
                Выйти
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-gray-900">Войти</Link>
          )}
        </nav>
      </div>
    </header>
  )
}