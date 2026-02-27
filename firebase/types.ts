import type {Photo} from 'react-photo-album'

export type Event = {
  id: string
  date: string // ISO string for datetime-local inputs and client-side formatting
  title: string
  draft?: boolean // Deprecated, use status
  status?: 'draft' | 'published' | 'hidden'
  endDate?: string // ISO string for datetime-local inputs
  isOngoing?: boolean // Overrides dates
  photos?: Photo[]
  type?: string
  location?: string
  image?: string
  description?: string
  locationDetails?: string
  locationLink?: string
  joinLink?: string
  duration?: number // in minutes
  price?: string // 10.00
  quantity?: number
}

export interface Comment {
  id: string
  targetId: string
  userId: string
  userDisplayName: string
  userPhotoURL: string
  text: string
  createdAt: number
  updatedAt?: number
  parentId?: string
  reactions?: Record<string, string[]>
}
