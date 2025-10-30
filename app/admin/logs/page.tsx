'use client'

import Breadcrumbs from '@/components/Breadcrumbs'
import {getLogs, LogEntry} from '@/firebase/actions/logs'
import {useAuthStore} from '@/firebase/AuthClient'
import {LOG_EVENT_TYPE} from '@/firebase/server'
import {getErrorMessage} from '@/lib/utils'
import {Autocomplete, AutocompleteItem} from '@heroui/autocomplete'
import {Button} from '@heroui/button'
import {Card, CardBody, CardHeader} from '@heroui/card'
import {Chip} from '@heroui/chip'
import {Input} from '@heroui/input'
import {Spinner} from '@heroui/spinner'
import {addToast} from '@heroui/toast'
import posthog from 'posthog-js'
import {useEffect, useState} from 'react'

const EVENT_TYPE_COLORS: Record<
  LOG_EVENT_TYPE,
  'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
> = {
  create_event: 'success',
  update_event: 'primary',
  delete_event: 'danger',
  move_event_photo: 'secondary',
  delete_event_photo: 'warning',
  add_event_photo: 'success',
  verify_admin_password: 'default',
  step_down_as_admin: 'warning',
}

const EVENT_TYPE_LABELS: Record<LOG_EVENT_TYPE, string> = {
  create_event: 'Create Event',
  update_event: 'Update Event',
  delete_event: 'Delete Event',
  move_event_photo: 'Move Photo',
  delete_event_photo: 'Delete Photo',
  add_event_photo: 'Add Photo',
  verify_admin_password: 'Admin Login',
  step_down_as_admin: 'Admin Logout',
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [limit, setLimit] = useState(50)
  const [filter, setFilter] = useState<LOG_EVENT_TYPE | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const {user, loading: authLoading} = useAuthStore()

  const loadLogs = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get token from localStorage (assuming it's stored there)
      const token = await user?.getIdToken()
      if (!token) {
        setError('No admin token found. Please log in.')
        return
      }

      const result = await getLogs(token, limit)
      if (result.success && result.logs) {
        setLogs(result.logs)
      } else {
        setError(result.message || 'Failed to load logs')
      }
    } catch (err) {
      posthog.capture('error', {
        error: 'Failed to load logs',
        message: getErrorMessage(err, 'Failed to load logs'),
      })
      addToast({
        title: 'Error',
        description: getErrorMessage(err, 'Failed to load logs'),
        color: 'danger',
      })
      setError('Failed to load logs')
      console.error('Error loading logs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return
    loadLogs()
  }, [limit, authLoading])

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'all' || log.event === filter
    const matchesSearch =
      searchTerm === '' ||
      log.userInfo.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userInfo.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  const formatData = (data: any) => {
    if (!data || Object.keys(data).length === 0) return 'No data'

    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  }

  if (loading && logs.length === 0) {
    return (
      <>
        <Breadcrumbs
          paths={[{href: '/', title: 'Home'}, {href: '/admin', title: 'Admin'}, {title: 'Logs'}]}
        />
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumbs
        paths={[
          {href: '/', title: 'Home'},
          {href: '/admin', title: 'Admin Dashboard'},
          {title: 'Logs'},
        ]}
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h1 className="mb-4 text-3xl font-bold">User Activity Logs</h1>

          {/* Controls */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />

            <Autocomplete
              placeholder="Filter by event type"
              selectedKey={filter}
              onSelectionChange={(key) => setFilter(key as LOG_EVENT_TYPE | 'all')}
              className="max-w-sm">
              <AutocompleteItem key="all">All Events</AutocompleteItem>
              <AutocompleteItem key="create_event">Create Event</AutocompleteItem>
              <AutocompleteItem key="update_event">Update Event</AutocompleteItem>
              <AutocompleteItem key="delete_event">Delete Event</AutocompleteItem>
              <AutocompleteItem key="move_event_photo">Move Event Photo</AutocompleteItem>
              <AutocompleteItem key="delete_event_photo">Delete Event Photo</AutocompleteItem>
              <AutocompleteItem key="add_event_photo">Add Event Photo</AutocompleteItem>
              <AutocompleteItem key="verify_admin_password">Admin Verified</AutocompleteItem>
              <AutocompleteItem key="step_down_as_admin">Admin Step Down</AutocompleteItem>
            </Autocomplete>

            <Autocomplete
              placeholder="Number of logs"
              selectedKey={limit.toString()}
              onSelectionChange={(key) => setLimit(Number(key))}
              className="max-w-sm">
              <AutocompleteItem key="25">25 logs</AutocompleteItem>
              <AutocompleteItem key="50">50 logs</AutocompleteItem>
              <AutocompleteItem key="100">100 logs</AutocompleteItem>
              <AutocompleteItem key="200">200 logs</AutocompleteItem>
            </Autocomplete>

            <Button onPress={loadLogs} color="primary">
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <Card className="mb-6">
            <CardBody>
              <div className="text-danger text-center">
                <p>{error}</p>
                <Button onPress={loadLogs} color="primary" className="mt-2">
                  Retry
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {filteredLogs.length === 0 && !loading ? (
          <Card>
            <CardBody>
              <div className="text-center text-gray-500">
                <p>No logs found matching your criteria.</p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <Card key={log.id} className="transition-shadow hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Chip color={EVENT_TYPE_COLORS[log.event]} variant="flat" size="sm">
                        {EVENT_TYPE_LABELS[log.event]}
                      </Chip>
                      <span className="text-sm text-gray-500">{formatDate(log.createdAt)}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">{log.userInfo.displayName}</div>
                      <div className="text-xs">{log.userInfo.email}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  {Object.keys(log.data).length > 0 && (
                    <div className="mt-3">
                      <details className="group">
                        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                          View Details
                        </summary>
                        <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs whitespace-pre-wrap">
                          {formatData(log.data)}
                        </pre>
                      </details>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {loading && logs.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </>
  )
}
