'use client'

import {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {useAuthStore} from '@/firebase/AuthClient'
import {addToast} from '@heroui/toast'
import {setEvent} from '@/firebase/actions/event.admin'
import {uploadEventPoster, deleteEventPoster} from '@/cloudinary/actions.admin'
import type {Event} from '@/firebase/types'
import {getErrorMessage, isoToLocalDateTimeInput} from '@/lib/utils'
import {useForm, Controller} from 'react-hook-form'
import {Button} from '@heroui/button'
import {PosterDropzone} from '@/app/admin/events/PosterDropzone'
import posthog from 'posthog-js'
import {Form} from '@heroui/form'
import {Input, Textarea} from '@heroui/input'
import {Checkbox} from '@heroui/checkbox'
import {NumberInput} from '@heroui/number-input'
import {DateRangePicker} from '@heroui/date-picker'
import {parseDate, parseDateTime, getLocalTimeZone, now} from '@internationalized/date'

export type EventFormValues = {
  title: string
  date: string
  draft?: boolean
  location?: string
  description?: string
  type?: string
  locationDetails?: string
  locationLink?: string
  joinLink?: string
  duration?: string
  price?: string
  quantity?: string
  image?: string
}

export function EventForm({event}: {event: Event & {id: string}}) {
  const router = useRouter()
  const {user} = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [isUploadingPoster, setIsUploadingPoster] = useState(false)

  const form = useForm<EventFormValues>({
    defaultValues: {
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
      image: '',
    },
  })
  const {register, handleSubmit, watch, setValue, control} = form
  const imageUrl = watch('image')

  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title || '',
        date: isoToLocalDateTimeInput(event.date) || '',
        draft: event.draft || false,
        location: event.location || '',
        description: event.description || '',
        type: event.type || '',
        locationDetails: event.locationDetails || '',
        locationLink: event.locationLink || '',
        joinLink: event.joinLink || '',
        duration: event.duration?.toString() || '',
        price: event.price || '',
        quantity: event.quantity?.toString() || '',
        image: event.image || '',
      })
    }
  }, [event, form.reset])

  const handlePosterFile = async (file: File) => {
    const eventId = event.id
    if (!user || !eventId) {
      return form.getValues('image') || ''
    }
    setIsUploadingPoster(true)
    try {
      const reader = new FileReader()
      const dataUrl: string = await new Promise((resolve, reject) => {
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
      const idToken = await user.getIdToken()
      const res = await uploadEventPoster({
        token: idToken,
        eventId,
        imageData: dataUrl,
      })
      if (res.success) {
        addToast({
          title: 'Poster uploaded',
          description: `Poster ${event ? 'updated' : 'attached to event'}`,
          color: 'success',
        })
        return res.imageUrl as string
      }
      posthog.capture('error', {
        error: 'Failed to upload poster',
        message: res.error || 'Failed to upload poster',
      })
      addToast({
        title: 'Upload failed',
        description: res.error || 'Failed to upload poster',
        color: 'danger',
      })
      return form.getValues('image') || ''
    } catch (error) {
      posthog.capture('error', {
        error: 'Failed to upload poster',
        message: getErrorMessage(error, 'Failed to upload poster'),
      })
      addToast({
        title: 'Failed to upload poster',
        description: getErrorMessage(error, 'Failed to upload poster'),
        color: 'danger',
      })
      return form.getValues('image') || ''
    } finally {
      setIsUploadingPoster(false)
    }
  }

  const handlePosterDelete = async () => {
    const eventId = event.id
    if (!user || !eventId) return
    const token = await user.getIdToken()
    const res = await deleteEventPoster({token, eventId})
    if (res.success) {
      addToast({
        title: 'Poster removed',
        description: 'Poster deleted from event',
        color: 'success',
      })
    } else {
      posthog.capture('error', {
        error: 'Failed to delete poster',
        message: res.error || 'Failed to delete poster',
      })
      addToast({
        title: 'Delete failed',
        description: res.error || 'Failed to delete poster',
        color: 'danger',
      })
    }
  }

  const onSubmit = async (values: EventFormValues) => {
    if (!user) return
    setLoading(true)
    try {
      const idToken = await user.getIdToken()
      const eventData = {
        ...values,
        duration: values.duration ? parseInt(values.duration) : undefined,
        quantity: values.quantity ? parseInt(values.quantity) : undefined,
        price: values.price || undefined,
      }
      const result = await setEvent(idToken, event.id, eventData)
      if (result.success) {
        addToast({title: 'Success', description: result.message, color: 'success'})
        return router.push('/admin/events')
      } else {
        addToast({title: 'Error', description: result.message, color: 'danger'})
      }
    } catch (error) {
      posthog.capture('error', {
        error: 'Failed to set event',
        message: getErrorMessage(error, 'Failed to set event'),
      })
      addToast({
        title: 'Error',
        description: `Failed to ${event ? 'update' : 'create'} event`,
        color: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="items-stretch space-y-4">
      <PosterDropzone
        imageUrl={imageUrl}
        onImageUrlChange={(url) => setValue('image', url, {shouldDirty: true})}
        onFileSelected={handlePosterFile}
        onDelete={async () => {
          await handlePosterDelete()
          setValue('image', '', {shouldDirty: true})
        }}
        disabled={isUploadingPoster}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Title" isRequired {...register('title', {required: true})} />

        <Controller
          name="date"
          control={control}
          rules={{required: true}}
          render={({field}) => (
            <DateRangePicker
              hideTimeZone
              isRequired
              showMonthAndYearPickers
              aria-label="Date & Time"
              label={`Date & Time (${(() => {
                const duration = Number(watch('duration'))
                if (!duration || isNaN(duration)) return undefined
                const hours = Math.floor(duration / 60)
                const minutes = duration % 60
                return `Duration: ${hours}:${minutes.toString().padStart(2, '0')}`
              })()} hours)`}
              popoverProps={{isNonModal: true}}
              value={
                field.value
                  ? {
                      start: parseDateTime(isoToLocalDateTimeInput(field.value)),
                      end: parseDateTime(
                        isoToLocalDateTimeInput(
                          new Date(
                            new Date(field.value).getTime() +
                              (Number(watch('duration')) || 0) * 60000
                          ).toISOString()
                        )
                      ),
                    }
                  : null
              }
              onChange={(value) => {
                const startIso = value?.start
                  ? value.start.toDate(getLocalTimeZone()).toISOString()
                  : ''
                const endIso = value?.end ? value.end.toDate(getLocalTimeZone()).toISOString() : ''
                field.onChange(startIso)
                if (startIso && endIso) {
                  const durationMinutes = Math.max(
                    0,
                    Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000)
                  )
                  setValue('duration', String(durationMinutes), {shouldDirty: true})
                }
              }}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />
        <Input label="Location" {...register('location')} />
        <Input label="Location Details" {...register('locationDetails')} />
        <Input label="Location Link" type="url" {...register('locationLink')} />
        <Input label="Type" {...register('type')} />
        <Input label="Price" type="text" {...register('price')} />
        <Controller
          name="quantity"
          control={control}
          render={({field}) => (
            <NumberInput
              label="Quantity"
              value={field.value ? Number(field.value) : undefined}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />
        <Input label="Join Link" type="url" {...register('joinLink')} />
      </div>
      <Textarea label="Description" {...register('description')} rows={4} />
      <Checkbox id="draft" {...register('draft')}>
        Draft Event (Hidden from public)
      </Checkbox>
      <div className="flex justify-end gap-2">
        <Button variant="flat" onPress={() => router.push('/admin/events')}>
          Cancel
        </Button>
        <Button type="submit" color="primary" isLoading={loading || isUploadingPoster}>
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </Form>
  )
}
