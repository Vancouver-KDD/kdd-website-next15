'use client'
import {EventForm} from '@/app/admin/events/EventForm'
import Breadcrumbs from '@/components/Breadcrumbs'
import {getEvent} from '@/firebase/actions/event.admin'
import {useAuthStore} from '@/firebase/AuthClient'
import type {Event} from '@/firebase/types'
import {getErrorMessage} from '@/lib/utils'
import {Button} from '@heroui/button'
import {Card, CardBody, CardHeader} from '@heroui/card'
import {Spacer} from '@heroui/spacer'
import {addToast} from '@heroui/toast'
import {useRouter} from 'next/navigation'
import posthog from 'posthog-js'
import {useEffect, useState} from 'react'

export default function EditEventPage({params}: {params: Promise<{eventId: string}>}) {
  const {user, admin, loading: authLoading} = useAuthStore()
  const router = useRouter()
  const [event, setEvent] = useState<(Event & {id: string}) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Wait for authentication to finish loading
    if (authLoading) {
      return
    }

    // If not admin after loading is complete, redirect
    if (!admin) {
      router.push('/events')
      return
    }

    loadEvent()
  }, [admin, authLoading, router])

  const loadEvent = async () => {
    setLoading(true)
    try {
      const resolvedParams = await params
      const token = await user?.getIdToken()
      if (!token) return
      const {success, event, message} = await getEvent(token, resolvedParams.eventId)
      if (!success) {
        posthog.capture('error', {
          error: 'Failed to load event',
          message: message,
        })
        addToast({
          title: 'Error',
          description: message,
          color: 'danger',
        })
      } else if (!event) {
        addToast({
          title: 'Error',
          description: 'Event not found',
          color: 'danger',
        })
        router.push('/admin/events')
      } else {
        setEvent(event)
      }
    } catch (error) {
      posthog.capture('error', {
        error: 'Failed to load event',
        message: getErrorMessage(error, 'Failed to load event'),
      })
      addToast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to load event'),
        color: 'danger',
      })
      router.push('/admin/events')
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
          <p className="mt-4">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-default-500">Event not found</p>
          <Button className="mt-4" onPress={() => router.push('/admin/events')}>
            Back to Admin Events
          </Button>
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
          {href: '/admin/events', title: 'Events'},
          {title: event?.title || 'Event Not Found'},
        ]}
      />
      <Spacer y={12} />
      <div className="mx-auto flex w-full max-w-screen-lg flex-col px-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Event Details</h3>
          </CardHeader>
          <CardBody>
            <EventForm event={event} />
          </CardBody>
        </Card>
      </div>
    </>
  )
}
