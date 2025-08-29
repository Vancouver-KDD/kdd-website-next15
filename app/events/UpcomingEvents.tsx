import {Suspense, use} from 'react'
import UpcomingEventsCarousel from './UpcomingEventsCarousel'
import {Skeleton} from '@heroui/skeleton'
import {getFutureEvents} from '@/firebase/queries'
import {Timestamp} from 'firebase-admin/firestore'

export default function UpcomingEvents() {
  const upcomingEvents = use(getFutureEvents())
  const events = upcomingEvents.map((event) => ({
    ...event,
    date: firebaseTimestampToISO8601(event.date),
    id: event.id,
  }))
  return (
    <Suspense
      fallback={
        <div className="h-96 w-56 space-y-5 p-4">
          <Skeleton className="rounded-lg">
            <div className="bg-default-300 h-24 rounded-lg" />
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="bg-default-200 h-3 w-3/5 rounded-lg" />
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="bg-default-200 h-3 w-4/5 rounded-lg" />
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="bg-default-300 h-3 w-2/5 rounded-lg" />
            </Skeleton>
          </div>
        </div>
      }>
      <UpcomingEventsCarousel events={events} />
    </Suspense>
  )
}
function firebaseTimestampToISO8601(timestamp: Timestamp) {
  // Firebase timestamp to CalendarDate
  return timestamp.toDate().toLocaleDateString('en-CA')
}
