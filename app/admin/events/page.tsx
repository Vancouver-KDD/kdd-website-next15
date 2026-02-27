'use client'

import Breadcrumbs from '@/components/Breadcrumbs'
import {getEvents} from '@/firebase/actions/event.admin'
import {useAuthStore} from '@/firebase/AuthClient'
import type {Event} from '@/firebase/types'
import {useDeleteEvent} from '@/hooks/useDeleteEvent'
import {cn, formatISODate, getErrorMessage} from '@/lib/utils'
import {Button} from '@heroui/button'
import {Card, CardBody, CardHeader} from '@heroui/card'
import {Chip} from '@heroui/chip'
import {Image} from '@heroui/image'
import {Link} from '@heroui/link'
import {Tabs, Tab} from '@heroui/tabs'
import {Spacer} from '@heroui/spacer'
import {addToast} from '@heroui/toast'
import {Calendar, Edit, MapPin, Plus, Trash2} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import posthog from 'posthog-js'
import {useTranslation} from '@/lib/i18n'
import en from '@/dictionaries/en.json'
import ko from '@/dictionaries/ko.json'

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

  const postedEvents = events.filter((e) => {
      // Legacy: !draft and no status -> published
      // New: status === 'published'
      if (e.status) return e.status === 'published'
      return !e.draft
  })
  
  const hiddenEvents = events.filter((e) => {
      // Legacy: draft is true -> hidden
      // New: status === 'hidden'
      if (e.status) return e.status === 'hidden'
      return e.draft
  })

  // New Concept: Draft (Unfinished) -> only available via new status field
  const draftEvents = events.filter((e) => e.status === 'draft')

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

      <div className="container mx-auto flex max-w-5xl flex-col px-6">
        <Link className="self-end" href={`/admin/events/${crypto.randomUUID()}/create`}>
          <Button color="primary" startContent={<Plus className="h-4 w-4" />}>
            Create Event
          </Button>
        </Link>
        <Spacer y={4} />

        <Tabs aria-label="Event Status">
            <Tab key="draft" title={<div className="flex items-center gap-2"><span>📝</span> Draft <Chip size="sm" variant="flat">{draftEvents.length}</Chip></div>}>
                 <EventList 
                    events={draftEvents} 
                    router={router} 
                    handleDelete={handleDelete} 
                    deletingEventId={deletingEventId}
                    emptyMessage="No draft events." 
                />
            </Tab>
            <Tab key="posted" title={<div className="flex items-center gap-2"><span>🚀</span> Posted <Chip size="sm" variant="flat">{postedEvents.length}</Chip></div>}>
                <EventList 
                    events={postedEvents} 
                    router={router} 
                    handleDelete={handleDelete} 
                    deletingEventId={deletingEventId} 
                    emptyMessage="No posted events."
                />
            </Tab>
            <Tab key="hidden" title={<div className="flex items-center gap-2"><span>🔒</span> Hidden <Chip size="sm" variant="flat">{hiddenEvents.length}</Chip></div>}>
                <EventList 
                    events={hiddenEvents} 
                    router={router} 
                    handleDelete={handleDelete} 
                    deletingEventId={deletingEventId}
                    emptyMessage="No hidden events." 
                />
            </Tab>
        </Tabs>
      </div>
    </>
  )
}

function EventList({events, router, handleDelete, deletingEventId, emptyMessage}: {
    events: (Event & {id: string})[], 
    router: any, 
    handleDelete: any, 
    deletingEventId: string | null,
    emptyMessage: string
}) {
    const {t} = useTranslation({...en, ...ko})
    if (events.length === 0) {
        return (
            <div className="py-6 text-center border-dashed border-2 rounded-xl flex flex-col items-center justify-center text-default-400">
                <p>{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id} className={cn('w-full', event.draft && 'opacity-60')}>
              <CardHeader className="flex items-start justify-between">
                <div className="bg-default-50 mr-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border">
                  {event.image ? (
                    <Image 
                        src={event.image} 
                        alt="Poster" 
                        className="h-full w-full object-cover" 
                        radius="none"
                        removeWrapper
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <div className="text-default-500 mt-2 flex items-start gap-4 text-sm">
                    <div className="flex items-start gap-1">
                      <Calendar className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      {formatISODate(event.date, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {event.location && (
                      <div className="flex items-start gap-1">
                        <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {event.draft && (
                    <Chip size="sm" variant="flat" color="warning">
                      {t('chips.hidden')}
                    </Chip>
                  )}
                  {new Date(event.date) > new Date() ? (
                    <Chip size="sm" classNames={{base: "bg-amber-600", content: "text-white font-medium"}}>{t('chips.upcoming')}</Chip>
                  ) : (
                    <Chip color="default" size="sm">{t('chips.past')}</Chip>
                  )}
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
    )
}
