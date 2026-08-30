// lib/normalizeSizes.ts
// Приводит строку размеров к аккуратному виду без лишних пробелов и пустых элементов:
// "40, 41 ,, 42" -> "40,41,42"

export function normalizeSizes(raw: string): string {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .join(',')
}
