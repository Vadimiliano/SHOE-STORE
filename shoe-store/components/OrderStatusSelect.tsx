// components/OrderStatusSelect.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const STATUSES = [
  { value: 'PROCESSING', label: 'В обработке' },
  { value: 'SHIPPED', label: 'Отправлен' },
  { value: 'DELIVERED', label: 'Доставлен' },
  { value: 'CANCELLED', label: 'Отменён' },
]

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function handleChange(newStatus: string) {
    const previousStatus = status
    setStatus(newStatus)
    setLoading(true)

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })

    setLoading(false)

    if (!res.ok) {
      setStatus(previousStatus) // откатываем select обратно, если сервер отклонил изменение
      const data = await res.json().catch(() => null)
      alert(data?.error ?? 'Не удалось изменить статус заказа')
      return
    }

    router.refresh()
  }

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value)}
      className="text-sm border border-gray-300 rounded-lg px-2 py-1"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  )
}
