import Breadcrumbs from '@/components/Breadcrumbs'
import {getEvent} from '@/firebase/queries'
import {Divider} from '@heroui/divider'
import Tabs from './Tabs'
import {Spacer} from '@heroui/spacer'

export default async function EventPage({params}: {params: Promise<{eventId: string}>}) {
  const {eventId} = await params
  const event = await getEvent(eventId)

  return (
    <div>
      <Breadcrumbs
        paths={[
          {href: '/', title: 'Home'},
          {href: '/events', title: 'Events'},
          {title: event?.title || 'Event Not Found'},
        ]}
      />
      {event ? (
        <>
          <div className="mx-auto flex max-w-screen-lg flex-col items-start px-6">
            <Divider className="my-6" />
            <div className="text-content1-foreground font-bold opacity-60">
              {event.type || 'ANNUAL SUMMER BBQ'}
            </div>
            <div className="text-content1-foreground font-medium opacity-50">
              {new Date(event.date).toLocaleDateString('en-CA')} | {event?.location}
            </div>
          </div>
          <div className="mx-auto flex max-w-screen-lg flex-col items-center px-6 text-center">
            <Spacer y={4} />
            <div className="text-6xl font-black">{event.title}</div>
            <Spacer y={16} />
            <Tabs event={event} />
          </div>
        </>
      ) : null}
    </div>
  )
}
