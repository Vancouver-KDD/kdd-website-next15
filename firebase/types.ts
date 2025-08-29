import {Timestamp} from 'firebase-admin/firestore'

export type Event = {
  title: string
  description: string
  date: Timestamp
  duration: number // in minutes
  location: string
  image: string
  registerLink?: string
}
