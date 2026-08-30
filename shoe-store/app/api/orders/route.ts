// app/api/orders/route.ts
// POST /api/orders — создаёт заказ на основе содержимого корзины

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/getCurrentUser'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Нужно войти в аккаунт' }, { status: 401 })
  }

  const { items } = (await request.json()) as {
    items: { productId: string; size: string; quantity: number }[]
  }

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Корзина пуста' }, { status: 400 })
  }

  // Корзина лежит в localStorage на клиенте, поэтому её легко подделать через devtools —
  // проверяем количество на сервере, а не доверяем тому, что пришло
  const hasInvalidQuantity = items.some(
    (i) => !Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 50
  )
  if (hasInvalidQuantity) {
    return NextResponse.json({ error: 'Некорректное количество товара' }, { status: 400 })
  }

  try {
    // Достаём реальные товары и цены из БД — НИКОГДА не доверяем цене, присланной с клиента
    const productIds = items.map((i) => i.productId)
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } })

    let total = 0
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) throw new Error('Товар не найден')

      // Проверяем, что выбранный размер реально есть у товара —
      // тоже защита от подмены данных в корзине на клиенте
      const availableSizes = product.sizes.split(',').map((s) => s.trim())
      if (!availableSizes.includes(item.size)) {
        throw new Error('Недоступный размер')
      }

      total += product.price * item.quantity
      return {
        productId: product.id,
        size: item.size,
        quantity: item.quantity,
        price: product.price, // фиксируем цену на момент заказа
      }
    })

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        status: 'PROCESSING',
        items: { create: orderItemsData },
      },
    })

    return NextResponse.json({ orderId: order.id })
  } catch {
    return NextResponse.json({ error: 'Не удалось оформить заказ' }, { status: 400 })
  }
}
