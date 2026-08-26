// components/ProductFilters.tsx
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'

const BRANDS = ['Nike', 'Adidas', 'New Balance', 'Puma']

export default function ProductFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Инициализируем поля значениями из текущего URL — так фильтры "помнят" себя при обновлении страницы
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')

  // Общая функция: берём текущие параметры URL, меняем один из них, переходим на новый URL
  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key) // пустое значение — убираем параметр из URL полностью
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  function toggleBrand(brand: string) {
    const current = searchParams.getAll('brand')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('brand')

    if (current.includes(brand)) {
      // если бренд уже выбран — убираем его
      current.filter((b) => b !== brand).forEach((b) => params.append('brand', b))
    } else {
      // иначе добавляем к списку выбранных брендов
      ;[...current, brand].forEach((b) => params.append('brand', b))
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const selectedBrands = searchParams.getAll('brand')

  return (
    <div className="space-y-6 bg-white p-5 rounded-xl border border-gray-100">
      {/* Поиск по названию */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Поиск</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && updateParam('search', search)}
          onBlur={() => updateParam('search', search)}
          placeholder="Название модели..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {/* Фильтр по бренду */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Бренд</label>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="rounded border-gray-300"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Диапазон цены */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Цена, ₽</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={() => updateParam('minPrice', minPrice)}
            placeholder="От"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() => updateParam('maxPrice', maxPrice)}
            placeholder="До"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Сортировка */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Сортировка</label>
        <select
          value={searchParams.get('sort') ?? 'newest'}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="newest">Сначала новые</option>
          <option value="price_asc">Цена: по возрастанию</option>
          <option value="price_desc">Цена: по убыванию</option>
        </select>
      </div>
    </div>
  )
}