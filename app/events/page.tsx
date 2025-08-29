import {sectionSubtitle, sectionTitle, subtitle, title} from '@/components/primitives'
import {Link} from '@heroui/link'
import {Spacer} from '@heroui/spacer'
import {button as buttonStyles} from '@heroui/theme'
import EventGroupSVG from './EventGroupSVG'
import UpcomingEventsCarousel from './UpcomingEventsCarousel'

export default function EventsPage() {
  return (
    <>
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
      <section className="flex justify-center">
        <EventGroupSVG width={458} />
      </section>
      <Spacer y={40} />
      <h1 className={sectionTitle({className: 'text-center'})}>Upcoming Events</h1>
      <h3 className={sectionSubtitle({className: 'text-center'})}>
        다가오는 KDD 행사를 만나보세요
      </h3>
      <Spacer y={24} />
      <UpcomingEventsCarousel />
    </>
  )
}
