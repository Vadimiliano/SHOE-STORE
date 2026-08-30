// app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminApi } from '@/lib/requireAdmin'

const ALLOWED_STATUSES = ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi()
  if (!admin) {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
  }

  const { id } = await params
  const { status } = await request.json()

  // Не даём записать в базу произвольную строку статуса — только из фиксированного списка
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Недопустимый статус заказа' }, { status: 400 })
  }

  try {
    const order = await prisma.order.update({ where: { id }, data: { status } })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 })
  }
}
