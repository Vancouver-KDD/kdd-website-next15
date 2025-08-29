import * as React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import UpcomingEvents from './UpcomingEvents'
import UpcomingCalendarEvents from './UpcomingCalendarEvents'
import {getFutureEvents} from '@/firebase/queries'
import {use} from 'react'
import {Timestamp} from 'firebase-admin/firestore'

function firebaseTimestampToISO8601(timestamp: Timestamp) {
  // Firebase timestamp to CalendarDate
  return timestamp.toDate().toLocaleDateString('en-CA')
}

export default function UpocmingEventsCarousel() {
  const upcomingEvents = use(getFutureEvents())
  return (
    <>
      <UpcomingCalendarEvents
        selectedDate={
          upcomingEvents[0] ? firebaseTimestampToISO8601(upcomingEvents[0].date) : undefined
        }
        dates={upcomingEvents.map((event) => firebaseTimestampToISO8601(event.date))}
      />
      <Carousel className="w-full max-w-4xl">
        <CarouselContent>
          {upcomingEvents.map((event) => {
            const {date, ...restEvent} = event
            const dateString = date.toDate().toLocaleDateString()
            return (
              <CarouselItem key={event.id} className="py-10">
                <UpcomingEvents {...restEvent} date={dateString} />
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  )
}
