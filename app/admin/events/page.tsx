'use client'

import {useAuthStore} from '@/firebase/AuthClient'
import {useEffect, useState} from 'react'
import {Button} from '@heroui/button'
import {Card, CardBody, CardHeader} from '@heroui/card'
import {Chip} from '@heroui/chip'
import {Spacer} from '@heroui/spacer'
import {Plus, Edit, Trash2, Calendar, MapPin} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {addToast} from '@heroui/toast'
import {getEvents} from '@/firebase/actions/event.admin'
import {cn, formatISODate, getErrorMessage} from '@/lib/utils'
import type {Event} from '@/firebase/types'
import Breadcrumbs from '@/components/Breadcrumbs'
import {Link} from '@heroui/link'
import {useDeleteEvent} from '@/hooks/useDeleteEvent'
import posthog from 'posthog-js'
import {Image} from '@heroui/image'

export default function AdminEventsPage() {
  const {user, admin, loading: authLoading} = useAuthStore()
  const router = useRouter()
  const [events, setEvents] = useState<(Event & {id: string})[]>([])
  const [loading, setLoading] = useState(true)
  const {handleDelete, deletingEventId} = useDeleteEvent({
    onSuccess: (eventId) => {
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId))
    },
  })

  useEffect(() => {
    loadEvents()
  }, [admin])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const token = await user?.getIdToken()
      if (!token) return
      const {success, events, message} = await getEvents(token)
      if (!success) {
        posthog.capture('error', {
          error: 'Failed to load events',
          message: message,
        })
        addToast({
          title: 'Error',
          description: message,
          color: 'danger',
        })
      } else {
        setEvents(events || [])
      }
    } catch (error) {
      posthog.capture('error', {
        error: 'Failed to load events',
        message: getErrorMessage(error, 'Failed to load events'),
      })
      addToast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to load events'),
        color: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
          <p className="mt-4">Checking admin status...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
          <p className="mt-4">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Breadcrumbs
        paths={[
          {href: '/', title: 'Home'},
          {href: '/admin', title: 'Admin Dashboard'},
          {title: 'Events'},
        ]}
      />
      <Spacer y={4} />

      <div className="container mx-auto flex max-w-screen-lg flex-col px-6">
        <Link className="self-end" href={`/admin/events/${crypto.randomUUID()}/create`}>
          <Button color="primary" startContent={<Plus className="h-4 w-4" />}>
            Create Event
          </Button>
        </Link>
        <Spacer y={4} />

        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id} className={cn('w-full', event.draft && 'opacity-60')}>
              <CardHeader className="flex items-start justify-between">
                <div className="bg-default-50 mr-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border">
                  {event.image ? (
                    <Image src={event.image} alt="Poster" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <div className="text-default-500 mt-2 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatISODate(event.date, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {event.draft && (
                    <Chip color="warning" size="sm" variant="flat">
                      Draft
                    </Chip>
                  )}
                  <Chip color={new Date(event.date) > new Date() ? 'success' : 'default'} size="sm">
                    {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody>
                {event.description && (
                  <p className="text-default-600 mb-4 line-clamp-3 text-sm">{event.description}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    startContent={<Edit className="h-4 w-4" />}
                    onPress={() => router.push(`/admin/events/${event.id}/edit`)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    startContent={<Trash2 className="h-4 w-4" />}
                    onPress={() => handleDelete(event.id, event.title)}
                    isLoading={deletingEventId === event.id}>
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => router.push(`/events/${event.id}`)}>
                    View
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-default-500">No events found. Create your first event!</p>
          </div>
        )}
      </div>
    </>
  )
}
