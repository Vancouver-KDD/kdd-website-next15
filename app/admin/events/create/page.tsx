'use client'
import {useState} from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import {Spacer} from '@heroui/spacer'
import {Card, CardBody, CardHeader} from '@heroui/card'
import {Button} from '@heroui/button'
import {addToast} from '@heroui/toast'
import {createEvent} from '@/firebase/actions/event.admin'
import {useAuthStore} from '@/firebase/AuthClient'
import {useRouter} from 'next/navigation'

export default function CreateEventPage() {
  const router = useRouter()
  return (
    <>
      <Breadcrumbs
        paths={[
          {href: '/', title: 'Home'},
          {href: '/admin', title: 'Admin Dashboard'},
          {href: '/admin/events', title: 'Events'},
          {title: 'Create Event'},
        ]}
      />
      <Spacer y={4} />
      <div className="mx-auto flex w-full max-w-screen-lg flex-col px-6">
        <EventForm
          onSuccess={() => {
            router.push('/admin/events')
          }}
        />
      </div>
    </>
  )
}

function EventForm({onSuccess}: {onSuccess: () => void}) {
  const {user} = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const idToken = await user.getIdToken()
      const eventData = {
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
        price: formData.price || undefined,
      }

      const result = await createEvent(idToken, eventData)
      console.log('result', result)

      if (result.success) {
        addToast({
          title: 'Success',
          description: result.message,
          color: 'success',
        })
        onSuccess()
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
        description: 'Failed to create event',
        color: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-lg font-semibold">Create New Event</h3>
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
              <label className="mb-1 block text-sm font-medium">Location Link</label>
              <input
                type="url"
                value={formData.locationLink}
                onChange={(e) => setFormData({...formData, locationLink: e.target.value})}
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
            <label className="mb-1 block text-sm font-medium">Location Details</label>
            <input
              type="text"
              value={formData.locationDetails}
              onChange={(e) => setFormData({...formData, locationDetails: e.target.value})}
              className="border-default-200 focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            />
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
            <Button type="submit" color="primary" isLoading={loading}>
              Create Event
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
