import {
  sectionSubtitle,
  sectionTitle,
  subtitle,
  title,
  label as labelStyles,
} from '@/components/primitives'
import {Link} from '@heroui/link'
import {Spacer} from '@heroui/spacer'
import {button as buttonStyles} from '@heroui/theme'
import EventGroupSVG from './EventGroupSVG'
import UpcomingEventsCarousel from './UpcomingEventsCarousel'
import {Divider} from '@heroui/divider'
import PastEventCard from './PastEventCard'

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
      <section className="mx-auto w-full max-w-screen-lg self-start px-6">
        <div className="text-center">
          <h1 className={title()}>Past Events</h1>
          <Spacer y={4} />
          <h3 className={subtitle()}>지난 KDD 행사들을 돌아보세요.</h3>
        </div>
        <Spacer y={9} />
        <Divider />
        <Spacer y={16} />
        <h3 className={labelStyles()}>2025</h3>
        <Spacer y={9} />
        <div className="grid grid-cols-1 items-center gap-22 md:grid-cols-2 lg:grid-cols-3">
          <PastEventCard
            title="Technology Uncertainty is coming..."
            image="https://picsum.photos/200/300"
            date="2025-01-01"
          />
          <PastEventCard
            title="Summer BBQ Party"
            image="https://picsum.photos/300/300"
            date="2025-01-01"
          />
          <PastEventCard
            title="Available soon."
            image="https://picsum.photos/500/200"
            date="2025-01-01"
          />
          <PastEventCard
            title="Available soon."
            image="https://picsum.photos/50/300"
            date="2025-01-01"
          />
        </div>
      </section>
    </>
  )
}
