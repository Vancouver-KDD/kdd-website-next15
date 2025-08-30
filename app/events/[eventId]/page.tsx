import Breadcrumbs from '@/components/Breadcrumbs'
import {getEvent} from '@/firebase/queries'

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
      <div className="mx-auto flex max-w-screen-lg flex-col items-start px-6">
        <div className="flex flex-col items-start">
          <div className="text-content1-foreground text-sm font-medium opacity-50">
            Coming Soon...
          </div>
        </div>
      </div>
    </div>
  )
}
