export function formatDuration(seconds: number | null): string {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatPhone(number: string | null): string {
  if (!number) return '—'
  const digits = number.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) {
    const n = digits.slice(1)
    return `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}`
  }
  return number
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function sentimentColor(sentiment: string | null): string {
  switch (sentiment?.toLowerCase()) {
    case 'positive': return 'text-green-700 bg-green-50'
    case 'negative': return 'text-red-700 bg-red-50'
    default: return 'text-gray-700 bg-gray-100'
  }
}

export function buildCallsQuery(params: URLSearchParams) {
  const filters: Record<string, string> = {}
  for (const [key, value] of params.entries()) {
    if (value) filters[key] = value
  }
  return filters
}
