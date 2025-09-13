import Breadcrumbs from '@/components/Breadcrumbs'
import {Link} from '@heroui/link'
import {Spacer} from '@heroui/spacer'

export default function AdminPage() {
  return (
    <>
      <Breadcrumbs paths={[{href: '/', title: 'Home'}, {title: 'Admin Dashboard'}]} />
      <Spacer y={4} />
      <div className="mx-auto flex w-full max-w-screen-lg flex-col px-6">
        <Spacer y={4} />
        <Link className="text-primary" href="/admin/events">
          Manage Events
        </Link>
        <Spacer y={2} />
        <Link className="text-primary" href="/admin/logs">
          View User Logs
        </Link>
        <Spacer y={4} />
      </div>
    </>
  )
}
