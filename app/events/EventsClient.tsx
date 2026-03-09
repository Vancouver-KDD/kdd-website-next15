'use client'
import {
  label as labelStyles,
  sectionSubtitle,
  sectionTitle,
  subtitle,
  title,
} from '@/components/primitives'
import en from '@/dictionaries/en.json'
import ko from '@/dictionaries/ko.json'
import {useTranslation} from '@/lib/i18n'
import {Divider} from '@heroui/divider'
import {Link} from '@heroui/link'
import {Spacer} from '@heroui/spacer'
import {button as buttonStyles} from '@heroui/theme'
import NextImage from 'next/image'
import EventGroupSVG from './event-group.avif'
import PastEventCard from './PastEventCard'
import UpcomingEvents from './UpcomingEvents'

import {Event} from '@/firebase/types'

export default function EventsClient({
  futureEvents,
  pastEvents,
}: {
  futureEvents: (Event & {id: string})[]
  pastEvents: (Event & {id: string})[]
}) {
  const {t} = useTranslation({...en, ...ko})

  return (
    <div className="flex flex-col items-center">
      <section className="mx-auto w-full max-w-5xl self-start px-6">
        <h1 className={title()}>{t('nav.events')}</h1>
        <Spacer y={4} />
        <h3 className={subtitle({className: 'max-w-[540px]'})}>{t('events.hero.subtitle')}</h3>
        <Spacer y={8} />
        <Link
          href="/about"
          className={buttonStyles({
            variant: 'shadow',
            radius: 'sm',
            size: 'md',
            color: undefined,
            className: 'bg-default-100 text-default-900',
          })}>
          About Us
        </Link>
      </section>
      <Spacer y={40} />
      <section className="mx-4 flex justify-center">
        <NextImage
          src={EventGroupSVG}
          width={460}
          height={314}
          className="w-[460px]"
          alt="Event Group"
        />
      </section>
      <Spacer y={6} />
      <section id="upcoming-events" className="w-full">
        <UpcomingEvents events={futureEvents} />
      </section>
      <Spacer className="h-20 md:h-40" />
      <section id="past-events" className="mx-auto w-full max-w-5xl self-start px-6">
        <div className="text-center">
          <h1 className={sectionTitle({className: 'text-center'})}>{t('events.sections.past')}</h1>
          <h3 className={sectionSubtitle({className: 'text-center'})}>
            {t('events.sections.past_subtitle')}
          </h3>
        </div>
        <Spacer y={6} />
        <Divider />
        {(() => {
          const groups = pastEvents.reduce((acc, event) => {
            const year = new Date(event.date).getFullYear()
            if (!acc.has(year)) acc.set(year, [])
            acc.get(year)!.push(event)
            return acc
          }, new Map<number, typeof pastEvents>())

          return Array.from(groups.entries()).map(([year, events]) => (
            <div key={year}>
              <Spacer y={16} />
              <h3 className={labelStyles()}>{year}</h3>
              <Spacer y={9} />
              <div className="grid grid-cols-1 items-center gap-22 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <PastEventCard key={event.id} {...event} />
                ))}
              </div>
            </div>
          ))
        })()}
      </section>
    </div>
  )
}
