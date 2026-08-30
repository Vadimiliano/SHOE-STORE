// components/Pagination.tsx
// Простая постраничная навигация. Это серверный компонент — просто рисует ссылки
// с уже посчитанными номерами страниц, сохраняя остальные параметры фильтров в URL.

import Link from 'next/link'

type SearchParams = Record<string, string | string[] | undefined>

type Props = {
  currentPage: number
  totalPages: number
  searchParams: SearchParams
}

function buildHref(searchParams: SearchParams, page: number) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === 'page') continue
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v))
    } else if (value) {
      params.set(key, value)
    }
  }

  if (page > 1) params.set('page', String(page))

  const qs = params.toString()
  return qs ? `/?${qs}` : '/'
}

export default function Pagination({ currentPage, totalPages, searchParams }: Props) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex justify-center items-center flex-wrap gap-2 mt-8">
      <Link
        href={buildHref(searchParams, Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`px-3 py-1.5 rounded-lg text-sm border ${
          currentPage === 1
            ? 'pointer-events-none opacity-40 border-gray-200 text-gray-400'
            : 'border-gray-300 text-gray-600 hover:border-gray-900'
        }`}
      >
        Назад
      </Link>

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(searchParams, p)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm border ${
            p === currentPage
              ? 'bg-gray-900 text-white border-gray-900'
              : 'border-gray-300 text-gray-600 hover:border-gray-900'
          }`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={buildHref(searchParams, Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`px-3 py-1.5 rounded-lg text-sm border ${
          currentPage === totalPages
            ? 'pointer-events-none opacity-40 border-gray-200 text-gray-400'
            : 'border-gray-300 text-gray-600 hover:border-gray-900'
        }`}
      >
        Вперёд
      </Link>
    </div>
  )
}
