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
export const PDT_TIMEZONE = 'America/Vancouver'

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

// Convert a DateValue from @internationalized/date to an ISO string
// This ensures the date/time is correctly interpreted in PDT timezone
// and converted to UTC for storage
// Uses a reliable method: find the UTC time that formats to the desired time in the target timezone
export function dateValueToISOString(
  dateValue: {year: number; month: number; day: number; hour: number; minute: number},
  timezone: string = PDT_TIMEZONE
): string {
  // Create a formatter for the target timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  // Strategy: Find the UTC time that, when formatted in the target timezone, equals our desired time
  // We'll search within a reasonable range (±14 hours covers all timezone offsets including DST)
  const searchRange = 14 // hours

  // Start with a UTC date at the target hour on the target date (treating it as if it were UTC)
  // This gives us a good starting point
  const dateStr = `${dateValue.year.toString().padStart(4, '0')}-${dateValue.month.toString().padStart(2, '0')}-${dateValue.day.toString().padStart(2, '0')}T${dateValue.hour.toString().padStart(2, '0')}:${dateValue.minute.toString().padStart(2, '0')}:00Z`
  const baseDate = new Date(dateStr)

  // Search for the correct UTC time by testing offsets
  // This handles DST and timezone variations correctly
  for (let offsetHours = -searchRange; offsetHours <= searchRange; offsetHours++) {
    const testDate = new Date(baseDate.getTime() + offsetHours * 60 * 60 * 1000)
    const parts = formatter.formatToParts(testDate)

    const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value || '0')

    // Check if this UTC time formats to our desired time in the target timezone
    if (
      get('year') === dateValue.year &&
      get('month') === dateValue.month &&
      get('day') === dateValue.day &&
      get('hour') === dateValue.hour &&
      get('minute') === dateValue.minute
    ) {
      return testDate.toISOString()
    }
  }

  // Fallback: if search didn't find a match (shouldn't happen), return the base date
  // This handles edge cases but should rarely be needed
  return baseDate.toISOString()
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

/**
 * Deep equality check for objects
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a == null || b == null) return a === b
  if (typeof a !== typeof b) return false
  if (typeof a !== 'object') return a === b

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (!isEqual(a[key], b[key])) return false
  }

  return true
}

/**
 * Find differences between two objects
 */
export function getObjectDiff<T extends Record<string, any>>(
  oldObj: T,
  newObj: Partial<T>
): Record<string, {from: any; to: any}> {
  const changes: Record<string, {from: any; to: any}> = {}

  for (const key in newObj) {
    if (newObj.hasOwnProperty(key)) {
      const oldValue = oldObj[key]
      const newValue = newObj[key]

      if (!isEqual(oldValue, newValue)) {
        changes[key] = {from: oldValue, to: newValue}
      }
    }
  }

  return changes
}

/**
 * Filter object to only include non-empty string fields and other meaningful values
 */
export function filterMeaningfulFields<T extends Record<string, any>>(obj: T): Partial<T> {
  const filtered: Partial<T> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      if (value.trim() !== '') {
        filtered[key as keyof T] = value as T[keyof T]
      }
    } else if (value !== undefined && value !== null) {
      filtered[key as keyof T] = value as T[keyof T]
    }
  }

  return filtered
}
