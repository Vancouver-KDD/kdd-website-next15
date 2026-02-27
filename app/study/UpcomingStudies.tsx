'use client'
import {sectionSubtitle, sectionTitle, subtitle} from '@/components/primitives'
import {getFutureStudies} from '@/firebase/actions/study'
import {Skeleton} from '@heroui/skeleton'
import {Spacer} from '@heroui/spacer'
import {Suspense, use} from 'react'
import UpcomingStudiesCarousel from './UpcomingStudiesCarousel'
import {useTranslation} from '@/lib/i18n'
import en from '@/dictionaries/en.json'
import ko from '@/dictionaries/ko.json'

import {Event} from '@/firebase/types'

export default function UpcomingStudies({studies}: {studies: (Event & {id: string})[]}) {
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
      {studies.length > 0 ? (
        <>
          <h1 className={sectionTitle({className: 'text-center'})}>{t('study.sections.upcoming')}</h1>
          <h3 className={sectionSubtitle({className: 'text-center'})}>
            {t('study.sections.upcoming_subtitle')}
          </h3>
          <Spacer y={6} />
          <UpcomingStudiesCarousel studies={studies} />
        </>
      ) : (
        <div className="flex flex-col items-center text-center">
          <Spacer y={8} />
          <div className="text-3xl font-bold">No Upcoming Studies</div>
          <Spacer y={4} />
          <div className={subtitle({className: 'opacity-60'})}>Please check back later</div>
          <Spacer y={8} />
        </div>
      )}
    </Suspense>
  )
}
