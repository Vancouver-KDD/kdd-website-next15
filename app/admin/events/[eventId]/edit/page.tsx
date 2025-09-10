'use client'

import {useAuthStore} from '@/firebase/AuthClient'
import {useEffect, useState} from 'react'
import {Button} from '@heroui/button'
import {Card, CardBody, CardHeader} from '@heroui/card'
import {Spacer} from '@heroui/spacer'
import {useRouter} from 'next/navigation'
import {addToast} from '@heroui/toast'
import {updateEvent} from '@/firebase/actions/event.admin'
import {getEvent} from '@/firebase/actions/event'
import {isoToLocalDateTimeInput} from '@/lib/utils'
import type {Event} from '@/firebase/types'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function EditEventPage({params}: {params: Promise<{eventId: string}>}) {
  const {user, admin, loading: authLoading} = useAuthStore()
  const router = useRouter()
  const [event, setEvent] = useState<(Event & {id: string}) | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    draft: false,
    location: '',
    description: '',
    type: '',
    locationDetails: '',
    locationLink: '',
    joinLink: '',
    duration: '',
    price: '',
    quantity: '',
  })

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
    try {
      const resolvedParams = await params
      const eventData = await getEvent(resolvedParams.eventId)
      if (!eventData) {
        addToast({
          title: 'Error',
          description: 'Event not found',
          color: 'danger',
        })
        router.push('/admin/events')
        return
      }

      setEvent(eventData)

      setFormData({
        title: eventData.title || '',
        // Display local time in the datetime-local input (YYYY-MM-DDTHH:MM)
        date: isoToLocalDateTimeInput(eventData.date) || '',
        draft: eventData.draft || false,
        location: eventData.location || '',
        description: eventData.description || '',
        type: eventData.type || '',
        locationDetails: eventData.locationDetails || '',
        locationLink: eventData.locationLink || '',
        joinLink: eventData.joinLink || '',
        duration: eventData.duration?.toString() || '',
        price: eventData.price || '',
        quantity: eventData.quantity?.toString() || '',
      })
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to load event',
        color: 'danger',
      })
      router.push('/admin/events')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !event) return

    setSaving(true)
    try {
      const idToken = await user.getIdToken()
      const eventData = {
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
        price: formData.price || undefined,
      }

      const result = await updateEvent(idToken, event.id, eventData as any)

      if (result.success) {
        addToast({
          title: 'Success',
          description: result.message,
          color: 'success',
        })
        router.push('/admin/events')
      } else {
        addToast({
          title: 'Error',
          description: result.message,
          color: 'danger',
        })
      }
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to update event',
        color: 'danger',
      })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
          <p className="mt-4">Loading...</p>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="border-default-200 focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="draft"
                    checked={formData.draft}
                    onChange={(e) => setFormData({...formData, draft: e.target.checked})}
                    className="text-primary focus:ring-primary border-default-300 h-4 w-4 rounded focus:ring-2"
                  />
                  <label htmlFor="draft" className="ml-2 text-sm font-medium">
                    Draft Event (Hidden from public)
                  </label>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="border-default-200 focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="border-default-200 focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Location Details</label>
                  <input
                    type="text"
                    value={formData.locationDetails}
                    onChange={(e) => setFormData({...formData, locationDetails: e.target.value})}
                    className="border-default-200 focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Location Link</label>
                  <input
                    type="url"
                    value={formData.locationLink}
                    onChange={(e) => setFormData({...formData, locationLink: e.target.value})}
                    className="border-default-200 focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Type</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="border-default-200 focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="border-default-200 focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Price</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="border-default-200 focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="border-default-200 focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Join Link</label>
                  <input
                    type="url"
                    value={formData.joinLink}
                    onChange={(e) => setFormData({...formData, joinLink: e.target.value})}
                    className="border-default-200 focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="border-default-200 focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="flat" onPress={() => router.push('/admin/events')}>
                  Cancel
                </Button>
                <Button type="submit" color="primary" isLoading={saving}>
                  Update Event
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
