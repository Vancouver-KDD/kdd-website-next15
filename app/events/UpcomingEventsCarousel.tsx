'use client'

import * as React from 'react'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import UpcomingEvent from './UpcomingEvent'
import UpcomingEventsCalendar from './UpcomingEventsCalendar'
import {Event} from '@/firebase/types'
import {useSelectedEventStore} from '@/app/store'

export default function UpcomingEventsCarousel({
  events,
}: {
  events: (Omit<Event, 'date'> & {date: string; id: string})[]
}) {
  const [api, setApi] = React.useState<CarouselApi>()
  const {selectedEventId, setSelectedEventId} = useSelectedEventStore()

  React.useEffect(() => {
    if (api?.selectedScrollSnap() !== events.findIndex((e) => e.id === selectedEventId)) {
      api?.scrollTo(events.findIndex((e) => e.id === selectedEventId))
    }
  }, [api, selectedEventId])

  React.useEffect(() => {
    if (!api) {
      return
    }

    api.on('select', () => {
      setSelectedEventId(events[api.selectedScrollSnap()].id)
    })
  }, [api])
  return (
    <>
      <UpcomingEventsCalendar events={events} />
      <Carousel className="mx-auto w-full max-w-4xl" setApi={setApi}>
        <CarouselContent>
          {events.map((event) => {
            return (
              <CarouselItem key={event.id} className="py-10">
                <UpcomingEvent {...event} />
              </CarouselItem>
            )
          })}
        </CarouselContent>
        {events.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </>
  )
}
