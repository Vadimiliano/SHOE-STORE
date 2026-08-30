// components/ProductForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  productId?: string // если передан — редактируем, если нет — создаём новый
  initialData?: {
    name: string
    description: string
    price: number
    brand: string
    imageUrl: string
    sizes: string
  }
}

const emptyData = { name: '', description: '', price: 0, brand: '', imageUrl: '', sizes: '' }

export default function ProductForm({ productId, initialData }: Props) {
  const router = useRouter()
  const [form, setForm] = useState(initialData ?? emptyData)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(field: keyof typeof form, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // При создании нового товара фото обязательно; при редактировании можно оставить прежнее
    if (!productId && !imageFile) {
      setError('Загрузите фото товара')
      return
    }

    setLoading(true)

    const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products'
    const method = productId ? 'PUT' : 'POST'

    // Отправляем как multipart/form-data — так в одном запросе уходят и текстовые поля, и файл
    const body = new FormData()
    body.append('name', form.name)
    body.append('description', form.description)
    body.append('price', String(form.price))
    body.append('brand', form.brand)
    body.append('sizes', form.sizes)
    if (imageFile) {
      body.append('image', imageFile)
    }

    const res = await fetch(url, { method, body })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Не удалось сохранить товар')
      return
    }

    router.push('/admin/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Название</label>
        <input
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Описание</label>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          rows={3}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Цена, ₽</label>
          <input
            required
            type="number"
            min={1}
            value={form.price}
            onChange={(e) => update('price', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Бренд</label>
          <input
            required
            value={form.brand}
            onChange={(e) => update('brand', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Фото товара</label>
        {previewUrl && (
          <div className="w-28 h-28 mb-2 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element -- это локальное превью загружаемого файла, next/image тут не подходит */}
            <img src={previewUrl} alt="Превью" className="w-full h-full object-cover" />
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="w-full text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">
          {productId
            ? 'Оставьте пустым, чтобы не менять текущее фото'
            : 'JPEG, PNG, WEBP или GIF, до 5 МБ'}
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Размеры (через запятую)
        </label>
        <input
          required
          value={form.sizes}
          onChange={(e) => update('sizes', e.target.value)}
          placeholder="39,40,41,42"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Сохраняем...' : 'Сохранить'}
      </button>
    </form>
  )
}
