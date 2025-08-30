import {title} from '@/components/primitives'

export default function EventPage({params}: {params: {eventId: string}}) {
  return (
    <div>
      <h1 className={title()}>Event Details Page</h1>
      <div className="text-content1-foreground text-sm font-medium opacity-50">Coming Soon...</div>
    </div>
  )
}
