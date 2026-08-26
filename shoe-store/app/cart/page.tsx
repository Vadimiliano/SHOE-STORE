// app/cart/page.tsx
'use client'

import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setError('')
    setLoading(true)

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          quantity: i.quantity,
        })),
      }),
    })

    setLoading(false)

    if (!res.ok) {
      if (res.status === 401) {
        router.push('/login') // не залогинен — отправляем войти
        return
      }
      const data = await res.json()
      setError(data.error ?? 'Не удалось оформить заказ')
      return
    }

    clearCart()
    router.push('/orders')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Корзина пуста.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Корзина</h1>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="flex items-center gap-4 border border-gray-100 rounded-xl p-4"
          >
            <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
            </div>

            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">Размер {item.size}</p>
              <p className="text-sm font-semibold mt-1">{item.price.toLocaleString('ru-RU')} ₽</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                className="w-7 h-7 border border-gray-300 rounded-md text-gray-600 hover:border-gray-900"
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                className="w-7 h-7 border border-gray-300 rounded-md text-gray-600 hover:border-gray-900"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.productId, item.size)}
              className="text-sm text-gray-400 hover:text-red-500 ml-2"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-6">
        <span className="text-gray-600">Итого</span>
        <span className="text-xl font-semibold">{totalPrice.toLocaleString('ru-RU')} ₽</span>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
      >
        {loading ? 'Оформляем...' : 'Оформить заказ'}
      </button>
    </div>
  )
}