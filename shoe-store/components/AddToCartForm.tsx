// components/AddToCartForm.tsx
'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'

type Props = {
  productId: string
  name: string
  price: number
  imageUrl: string
  sizes: string[]
}

export default function AddToCartForm({ productId, name, price, imageUrl, sizes }: Props) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    if (!selectedSize) return
    addItem({ productId, name, price, imageUrl, size: selectedSize }, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">Размер</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`px-3 py-1.5 border rounded-lg text-sm transition ${
              selectedSize === size
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 hover:border-gray-900'
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      {!selectedSize && <p className="text-xs text-gray-400 mb-2">Выберите размер</p>}

      <button
        onClick={handleAdd}
        disabled={!selectedSize}
        className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {added ? 'Добавлено ✓' : 'Добавить в корзину'}
      </button>
    </div>
  )
}