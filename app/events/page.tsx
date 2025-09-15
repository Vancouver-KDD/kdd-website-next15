import {label as labelStyles, subtitle, title} from '@/components/primitives'
import {getPastEvents} from '@/firebase/actions/event'
import {Divider} from '@heroui/divider'
import {Link} from '@heroui/link'
import {Spacer} from '@heroui/spacer'
import {button as buttonStyles} from '@heroui/theme'
import NextImage from 'next/image'
import {use} from 'react'
import EventGroupSVG from './event-group.avif'
import PastEventCard from './PastEventCard'
import UpcomingEvents from './UpcomingEvents'

export default function EventsPage() {
  const pastEvents = use(getPastEvents())

  return (
    <div className="flex flex-col items-center">
      <section className="mx-auto w-full max-w-screen-lg self-start px-6">
        <h1 className={title()}>Event</h1>
        <Spacer y={4} />
        <h3 className={subtitle({className: 'max-w-[540px]'})}>
          KDD는 매월 정기 모임과 연례 컨퍼런스를 통해 지식과 경험을 나누고 있습니다. 다가오는
          이벤트를 확인하고 함께하세요.
        </h3>
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
      <UpcomingEvents />
      <section id="past-events" className="mx-auto w-full max-w-screen-lg self-start px-6">
        <div className="text-center">
          <h1 className={title()}>Past Events</h1>
          <Spacer y={4} />
          <h3 className={subtitle()}>지난 KDD 행사들을 돌아보세요.</h3>
        </div>
        <Spacer y={9} />
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
