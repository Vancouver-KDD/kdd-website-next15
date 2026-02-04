import {getFutureEvents} from '@/firebase/actions/event'
import HomeClient from './HomeClient'

export default async function Home() {
  const futureEvents = await getFutureEvents()
  return <HomeClient futureEvents={futureEvents} />
}
