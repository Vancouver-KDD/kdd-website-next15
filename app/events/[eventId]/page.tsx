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
            <div className="mb-8 text-4xl font-black md:mb-16 md:text-6xl">{event.title}</div>
            <Tabs event={event} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-10">
          <h1 className="text-xl font-bold">
            The event you are looking for does not exist or was deleted.
          </h1>
        </div>
      )}
    </div>
  )
}
