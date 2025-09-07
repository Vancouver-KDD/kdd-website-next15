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
