// lib/uploadImage.ts
// Сохраняет загруженный файл изображения на диск в /public/uploads
// и возвращает публичный путь к нему (например, "/uploads/xxxxx.jpg"),
// который потом просто кладём в поле Product.imageUrl.

import { writeFile, mkdir } from 'fs/promises'
import { randomUUID } from 'crypto'
import path from 'path'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5 МБ

const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

// Отдельный класс ошибки, чтобы в API-роуте можно было отличить
// "файл не подошёл" от неожиданной ошибки диска и показать пользователю понятный текст
export class UploadError extends Error {}

export async function saveUploadedImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new UploadError('Разрешены только изображения JPEG, PNG, WEBP или GIF')
  }
  if (file.size > MAX_SIZE) {
    throw new UploadError('Файл слишком большой (максимум 5 МБ)')
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadsDir, { recursive: true })

  const ext = EXT_BY_TYPE[file.type] ?? 'jpg'
  const filename = `${randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  await writeFile(path.join(uploadsDir, filename), buffer)

  return `/uploads/${filename}`
}
