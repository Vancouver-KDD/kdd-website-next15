'use client'

import {useSelectedEventStore} from '@/app/store'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {Event} from '@/firebase/types'
import * as React from 'react'
import UpcomingStudy from './UpcomingStudy'
import UpcomingStudiesCalendar from './UpcomingStudiesCalendar'

export default function UpcomingStudiesCarousel({
  studies,
}: {
  studies: (Omit<Event, 'date'> & {date: string; id: string})[]
}) {
  const [api, setApi] = React.useState<CarouselApi>()
  const {selectedEventId, setSelectedEventId} = useSelectedEventStore()

  React.useEffect(() => {
    if (api?.selectedScrollSnap() !== studies.findIndex((e) => e.id === selectedEventId)) {
      api?.scrollTo(studies.findIndex((e) => e.id === selectedEventId))
    }
  }, [api, selectedEventId])

  React.useEffect(() => {
    if (!api) {
      return
    }

    api.on('select', () => {
      setSelectedEventId(studies[api.selectedScrollSnap()].id)
    })
  }, [api])
  return (
    <div className="flex flex-col items-center">
      <UpcomingStudiesCalendar studies={studies} />
      <Carousel className="mx-auto w-full max-w-4xl" setApi={setApi}>
        <CarouselContent>
          {studies.map((study) => {
            return (
              <CarouselItem key={study.id} className="py-10">
                <UpcomingStudy {...study} />
              </CarouselItem>
            )
          })}
        </CarouselContent>
        {studies.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  )
}
