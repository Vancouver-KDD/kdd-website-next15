import {getFutureEvents, getPastEvents} from '@/firebase/actions/event'
import EventsClient from './EventsClient'

export default async function EventsPage() {
  const [futureEvents, pastEvents] = await Promise.all([getFutureEvents(), getPastEvents()])
  return <EventsClient futureEvents={futureEvents} pastEvents={pastEvents} />
}
