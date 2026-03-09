'use client'

import {Event} from '@/firebase/types'
import {Card, CardBody, CardHeader} from '@heroui/card'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface DashboardChartsProps {
  events: Event[]
}

export default function DashboardCharts({events}: DashboardChartsProps) {
  // Process data for charts
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // 1. Participant Count per Event (Bar Chart)
  // Filter out events with 0 participants or future events if needed
  const barData = sortedEvents
    .filter((e) => (e.quantity || 0) > 0)
    .map((e) => ({
      name: e.title.length > 25 ? `${e.title.substring(0, 25)}...` : e.title,
      participants: e.quantity || 0,
      fullTitle: e.title,
      date: e.date,
    }))
    .slice(-5) // Show last 5 events

  // 2. Accumulated Participants (Line Chart)
  // Group by year or just cumulative over all time
  let cumulativeCount = 0
  const releaseYear = 2017 // Assuming KDD started around then or just track all data

  const lineData = sortedEvents
    .filter((e) => (e.quantity || 0) > 0)
    .map((e) => {
      cumulativeCount += e.quantity || 0
      return {
        date: e.date.split(' ')[0], // Just date part
        accumulated: cumulativeCount,
        event: e.title,
      }
    })

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Bar Chart: Recent Event Participation */}
      <Card className="min-h-[400px]">
        <CardHeader className="flex flex-col items-start px-6 pt-6">
          <h3 className="text-large font-bold">Event Participation</h3>
          <p className="text-small text-default-500">Recent events participant counts</p>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{top: 20, right: 30, left: 20, bottom: 60}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={100}
                tick={{fontSize: 12}}
              />
              <YAxis domain={[0, 'auto']} />
              <Tooltip
                content={({active, payload}: any) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-white p-2 shadow-sm">
                        <p className="font-bold">{payload[0].payload.fullTitle}</p>
                        <p className="text-sm">{payload[0].payload.date}</p>
                        <p className="text-primary text-sm">Participants: {payload[0].value}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="participants" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Line Chart: Cumulative Growth */}
      <Card className="min-h-[400px]">
        <CardHeader className="flex flex-col items-start px-6 pt-6">
          <h3 className="text-large font-bold">Community Growth</h3>
          <p className="text-small text-default-500">Accumulated participants over time</p>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData} margin={{top: 20, right: 30, left: 20, bottom: 20}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickFormatter={(date: string) => date.split('-')[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="accumulated"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                activeDot={{r: 8}}
                name="Total Participants"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  )
}
