export type Event = {
  id: string
  date: string // CalendarDate ie YYYY-MM-DD HH:MM
  title: string
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
