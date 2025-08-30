import {Timestamp} from 'firebase-admin/firestore'

export type Event = {
  id: string
  date: Timestamp
  title: string
  location?: string
  image: string // can be empty string
  description?: string
  locationDetails?: string
  locationLink?: string
  joinLink?: string
  duration?: number // in minutes
  price?: string // 10.00
  quantity?: number
}
