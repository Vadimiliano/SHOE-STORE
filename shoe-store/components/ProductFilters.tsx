// components/ProductFilters.tsx
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'

type Props = {
  availableBrands: string[]
  availableSizes: string[]
}

export default function ProductFilters({ availableBrands, availableSizes }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Инициализируем поля значениями из текущего URL — так фильтры "помнят" себя при обновлении страницы
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')

  // Общая функция: берём текущие параметры URL, меняем один из них, переходим на новый URL.
  // При любом изменении фильтров сбрасываем номер страницы, чтобы не остаться на пустой странице №5
  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key) // пустое значение — убираем параметр из URL полностью
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  // Общая функция для чекбоксов-мультивыборов (бренд, размер) — параметр может повторяться в URL
  function toggleListParam(key: string, value: string) {
    const current = searchParams.getAll(key)
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)

    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    next.forEach((v) => params.append(key, v))
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  function resetFilters() {
    router.push(pathname)
  }

  const selectedBrands = searchParams.getAll('brand')
  const selectedSizes = searchParams.getAll('size')

  return (
    <div className="space-y-6 bg-white p-5 rounded-xl border border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Фильтры</h2>
        <button type="button" onClick={resetFilters} className="text-xs text-gray-400 hover:text-gray-900">
          Сбросить
        </button>
      </div>

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

      {/* Фильтр по бренду — список берём из реальных товаров в базе */}
      {availableBrands.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Бренд</label>
          <div className="space-y-2">
            {availableBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleListParam('brand', brand)}
                  className="rounded border-gray-300"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Фильтр по размеру */}
      {availableSizes.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Размер</label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleListParam('size', size)}
                className={`px-2.5 py-1 border rounded-lg text-xs transition ${
                  selectedSizes.includes(size)
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-gray-900'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

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
