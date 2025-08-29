import * as React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import UpcomingEvents from '../UpcomingEvents'
import UpcomingCalendarEvents from './UpcomingCalendarEvents'

export default function UpocmingEventsCarousel() {
  return (
    <>
      <UpcomingCalendarEvents />
      <Carousel className="w-full max-w-4xl">
        <CarouselContent>
          {Array.from({length: 5}).map((_, index) => (
            <CarouselItem key={index} className="py-10">
              <UpcomingEvents />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  )
}
