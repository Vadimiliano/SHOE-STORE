// components/ProductCard.tsx
import Link from 'next/link'
import Image from 'next/image'

type Props = {
  id: string
  name: string
  brand: string
  price: number
  imageUrl: string
}

export default function ProductCard({ id, name, brand, price, imageUrl }: Props) {
  return (
    <Link
      href={`/products/${id}`}
      className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square bg-gray-50">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{brand}</p>
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">{name}</h3>
        <p className="font-semibold text-gray-900">{price.toLocaleString('ru-RU')} ₽</p>
      </div>
    </Link>
  )
}