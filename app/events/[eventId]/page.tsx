import {Breadcrumbs, BreadcrumbItem} from '@heroui/breadcrumbs'

export default function EventPage({params}: {params: {eventId: string}}) {
  return (
    <div>
      <div className="text-content1-foreground text-sm font-medium opacity-50">Coming Soon...</div>
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Music</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  )
}
