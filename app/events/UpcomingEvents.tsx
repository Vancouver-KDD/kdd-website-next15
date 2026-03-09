'use client'
import {sectionSubtitle, sectionTitle, subtitle} from '@/components/primitives'
import en from '@/dictionaries/en.json'
import ko from '@/dictionaries/ko.json'
import {useTranslation} from '@/lib/i18n'
import {Skeleton} from '@heroui/skeleton'
import {Spacer} from '@heroui/spacer'
import {Suspense} from 'react'
import UpcomingEventsCarousel from './UpcomingEventsCarousel'

import {Event} from '@/firebase/types'

export default function UpcomingEvents({events}: {events: (Event & {id: string})[]}) {
  const {t} = useTranslation({...en, ...ko})
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
      {events.length > 0 ? (
        <>
          <h1 className={sectionTitle({className: 'text-center'})}>
            {t('events.sections.upcoming')}
          </h1>
          <h3 className={sectionSubtitle({className: 'text-center'})}>
            {t('events.sections.upcoming_subtitle')}
          </h3>
          <Spacer y={6} />
          <UpcomingEventsCarousel events={events} />
        </>
      ) : (
        <div className="flex flex-col items-center text-center">
          <Spacer y={8} />
          <div className="text-3xl font-bold">No Upcoming Events</div>
          <Spacer y={4} />
          <div className={subtitle({className: 'opacity-60'})}>Please check back later</div>
          <Spacer y={8} />
        </div>
      )}
    </Suspense>
  )
}
