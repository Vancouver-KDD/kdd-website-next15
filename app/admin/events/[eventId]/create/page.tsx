import Breadcrumbs from '@/components/Breadcrumbs'
import {Spacer} from '@heroui/spacer'
import {Card, CardBody, CardHeader} from '@heroui/card'
import {EventForm} from '@/app/admin/events/EventForm'
import {isoToLocalDateTimeInput} from '@/lib/utils'

export default async function CreateEventPage({params}: {params: Promise<{eventId: string}>}) {
  const {eventId} = await params

  return (
    <>
      <Breadcrumbs
        paths={[
          {href: '/', title: 'Home'},
          {href: '/admin', title: 'Admin Dashboard'},
          {href: '/admin/events', title: 'Events'},
          {title: 'Create Event'},
        ]}
      />
      <Spacer y={4} />
      <div className="mx-auto flex w-full max-w-screen-lg flex-col px-6">
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold">Create New Event</h3>
          </CardHeader>
          <CardBody>
            <EventForm
              event={{
                id: eventId,
                title: 'Untitled',
                date: isoToLocalDateTimeInput(new Date().toISOString()),
                draft: true,
              }}
            />
          </CardBody>
        </Card>
      </div>
    </>
  )
}
