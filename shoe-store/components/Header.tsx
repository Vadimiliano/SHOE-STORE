// components/Header.tsx
'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const { totalItems } = useCart()

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          shoe-store
        </Link>

        <nav className="flex items-center gap-5 text-sm text-gray-600">
          <Link href="/orders" className="hover:text-gray-900">Мои заказы</Link>
          <Link href="/login" className="hover:text-gray-900">Войти</Link>
          <Link href="/cart" className="relative hover:text-gray-900">
            Корзина
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}