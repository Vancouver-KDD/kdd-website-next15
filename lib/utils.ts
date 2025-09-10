import {clsx, type ClassValue} from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function arrayMove<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const array = list.slice()
  if (fromIndex === toIndex) return array
  const start = Math.max(0, Math.min(array.length - 1, fromIndex))
  const end = Math.max(0, Math.min(array.length - 1, toIndex))
  const [moved] = array.splice(start, 1)
  array.splice(end, 0, moved)
  return array
}

export function getErrorMessage(error: unknown, defaultMessage?: string) {
  if (error instanceof Error) {
    return error.message
  }
  return defaultMessage || 'Unknown error'
}

// PDT timezone constant
const PDT_TIMEZONE = 'America/Vancouver'

export function formatISODate(isoDateString: string, options?: Intl.DateTimeFormatOptions) {
  if (!isoDateString) return ''

  try {
    const date = new Date(isoDateString)
    if (isNaN(date.getTime())) return ''

    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: PDT_TIMEZONE,
    }

    return date.toLocaleDateString('en-CA', {...defaultOptions, ...options})
  } catch {
    return ''
  }
}

// Format ISO date to PDT timezone for display (includes time)
export function formatISODateTime(isoDateString: string, options?: Intl.DateTimeFormatOptions) {
  return formatISODate(isoDateString, {hour: '2-digit', minute: '2-digit', ...options})
}

// Convert an ISO string to a value suitable for <input type="datetime-local">
// Returns string formatted as YYYY-MM-DDTHH:MM in the specified timezone (default PDT)
export function isoToLocalDateTimeInput(isoDateString: string) {
  if (!isoDateString) return ''
  try {
    const date = new Date(isoDateString)
    if (isNaN(date.getTime())) return ''

    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: PDT_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    const parts = formatter.formatToParts(date)
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((p) => p.type === type)?.value || ''
    const year = get('year')
    const month = get('month')
    const day = get('day')
    const hour = get('hour')
    const minute = get('minute')

    if (!year || !month || !day || !hour || !minute) return ''
    return `${year}-${month}-${day}T${hour}:${minute}`
  } catch {
    return ''
  }
}

// Color pairs for harmonious gradients - [400 shade, 200 shade]
const GRADIENT_COLORS = [
  ['#a78bfa', '#c4b5fd'], // purple-400, purple-200
  ['#fb923c', '#fed7aa'], // orange-400, orange-200
  ['#34d399', '#a7f3d0'], // emerald-400, emerald-200
  ['#f472b6', '#fbcfe8'], // pink-400, pink-200
  ['#38bdf8', '#bae6fd'], // sky-400, sky-200
  ['#f87171', '#fecaca'], // red-400, red-200
  ['#94a3b8', '#e2e8f0'], // slate-400, slate-200
  ['#a3e635', '#d9f99d'], // lime-400, lime-200
  ['#fb7185', '#fecdd3'], // rose-400, rose-200
  ['#fbbf24', '#fde68a'], // amber-400, amber-200
  ['#c084fc', '#ddd6fe'], // violet-400, violet-200
  ['#2dd4bf', '#99f6e4'], // teal-400, teal-200
  ['#e879f9', '#f5d0fe'], // fuchsia-400, fuchsia-200
  ['#4ade80', '#bbf7d0'], // green-400, green-200
  ['#60a5fa', '#bfdbfe'], // blue-400, blue-200
]

/**
 * Generates an SVG data URL with a radial gradient based on event title
 * @param input - The string to generate gradient from (e.g., event title)
 * @param width - Optional width for the SVG (default: 400)
 * @param height - Optional height for the SVG (default: 400)
 * @returns SVG data URL string
 */
export function generateGradientSVG(
  input: string,
  width: number = 400,
  height: number = 400
): string {
  // Simple hash function to convert string to number
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Get harmonious color pair - same color family, different brightness
  const index = Math.abs(hash) % GRADIENT_COLORS.length
  const [toHex, fromHex] = GRADIENT_COLORS[index] // [400 shade, 200 shade] - bright outer, light center

  // Generate gradient ID based on input to avoid conflicts
  const gradientId = `gradient-${Math.abs(input.split('').reduce((a, b) => a + b.charCodeAt(0), 0))}`

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="${gradientId}" cx="50%" cy="50%" r="70%">
          <stop offset="0%" style="stop-color:${fromHex};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${toHex};stop-opacity:1" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#${gradientId})" />
    </svg>
  `.trim()

  return `data:image/svg+xml;base64,${btoa(svg)}`
}
