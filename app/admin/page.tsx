import {scrapeLumaEvent} from '@/app/actions/scrape-luma'
import eventsData from '@/app/events/events.json'
import {Event} from '@/firebase/types'
import Breadcrumbs from '@/components/Breadcrumbs'
import DashboardCharts from '@/components/admin/DashboardCharts'
import LumaSyncButton from '@/components/admin/LumaSyncButton'
import {Card, CardBody} from '@heroui/card'
import {Button} from '@heroui/button'
import ManageDropdown from '@/components/admin/ManageDropdown'
import {Link} from '@heroui/link'
import {Spacer} from '@heroui/spacer'

export default function AdminPage() {
  const events = eventsData as unknown as Event[]
  
  // Calculate summary stats
  const totalEvents = events.length
  const totalParticipants = events.reduce((sum, e) => sum + (e.quantity || 0), 0)
  const avgParticipants = totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0

  return (
    <>
      <Breadcrumbs paths={[{href: '/', title: 'Home'}, {title: 'Admin Dashboard'}]} />
      <Spacer y={4} />
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <LumaSyncButton events={events} />
          </div>
          <div className="flex gap-4">
             <Button as={Link} color="primary" variant="flat" href="/admin/logs">
              View User Logs
            </Button>
            
            <ManageDropdown />
          </div>
        </div>
        
        <Spacer y={6} />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardBody className="flex flex-col items-center justify-center py-6">
              <p className="text-default-500 text-sm uppercase font-bold">Total Participants</p>
              <p className="text-4xl font-bold text-primary">{totalParticipants.toLocaleString()}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-col items-center justify-center py-6">
              <p className="text-default-500 text-sm uppercase font-bold">Total Events</p>
              <p className="text-4xl font-bold text-secondary">{totalEvents}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-col items-center justify-center py-6">
              <p className="text-default-500 text-sm uppercase font-bold">Average Attendance</p>
              <p className="text-4xl font-bold text-success">{avgParticipants}</p>
            </CardBody>
          </Card>
        </div>

        <Spacer y={8} />

        {/* Analytics Charts */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
          <DashboardCharts events={events} />
        </div>

        <Spacer y={8} />
      </div>
    </>
  )
}
