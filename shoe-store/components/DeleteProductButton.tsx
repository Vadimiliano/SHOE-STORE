// components/DeleteProductButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Удалить товар?')) return
    setLoading(true)
    const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
    setLoading(false)

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      alert(data?.error ?? 'Не удалось удалить товар')
      return
    }

    router.refresh() // перезапрашивает данные Server Component без полной перезагрузки страницы
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="text-red-400 hover:text-red-600">
      {loading ? '...' : 'Удалить'}
    </button>
  )
}
