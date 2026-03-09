'use client'

import {PosterDropzone} from '@/app/admin/events/PosterDropzone'
import {deleteEventPoster, uploadEventPoster} from '@/cloudinary/actions.admin'
import {setEvent} from '@/firebase/actions/event.admin'
import {moveEventToStudy, setStudy} from '@/firebase/actions/study.admin'
import {useAuthStore} from '@/firebase/AuthClient'
import type {Event} from '@/firebase/types'
import {EVENT_SUBTYPES, STUDY_SUBTYPES} from '@/lib/constants' // Added constants
import {dateValueToISOString, getErrorMessage, isoToLocalDateTimeInput} from '@/lib/utils'
import {Autocomplete, AutocompleteItem} from '@heroui/autocomplete'
import {Button} from '@heroui/button'
import {DateRangePicker} from '@heroui/date-picker'
import {Form} from '@heroui/form'
import {Popover, PopoverContent, PopoverTrigger} from '@heroui/popover'
// import {Radio, RadioGroup} from '@heroui/radio' // Failed to install
import {Input, Textarea} from '@heroui/input'
import {NumberInput} from '@heroui/number-input'
import {addToast} from '@heroui/toast'
import {parseDateTime} from '@internationalized/date'
import {useRouter} from 'next/navigation'
import posthog from 'posthog-js'
import {useEffect, useState} from 'react'
import {Controller, useForm} from 'react-hook-form'

export type EventFormValues = {
  title: string
  date: string
  // draft?: boolean // Deprecated
  status: 'draft' | 'published' | 'hidden'
  location?: string
  description?: string
  typeFilter: string // 'Event' or 'Study'
  type?: string // Sub-type
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
      status: 'draft', // Default to draft for new items
      location: '',
      description: '',
      typeFilter: 'Event', // Default to Event
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
      // Determine efficient typeFilter
      // Status migration logic:
      // 1. prefer event.status
      // 2. fallback to event.draft (true -> hidden)
      // 3. fallback to published (false/undefined)
      let status: 'draft' | 'published' | 'hidden' = 'published'
      if (event.status) {
        status = event.status
      } else if (event.draft) {
        status = 'hidden'
      }

      form.reset({
        title: event.title || '',
        date: event.date || '', // Store ISO string, not local format
        status,
        location: event.location || '',
        description: event.description || '',
        typeFilter: 'Event', // Initialize as Event
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
        // Sync legacy draft field for compatibility if needed, or just rely on status
        draft: values.status === 'hidden' || values.status === 'draft',
      }
      delete (eventData as any).typeFilter // Remove typeFilter from saved data

      let result
      const isMigration = values.typeFilter === 'Study'

      if (isMigration && event.id) {
        // Migrating Event -> Study
        // 1. First move it
        const moveRes = await moveEventToStudy(idToken, event.id)
        if (!moveRes.success) throw new Error(moveRes.message)

        // 2. Then update it with new data in the new location
        // Note: moveEventToStudy keeps the same ID
        result = await setStudy(idToken, event.id, eventData)
      } else if (isMigration && !event.id) {
        // Creating new Study from Event Form (unlikely but handling it)
        // Actually setStudy creates if ID doesn't exist, but we need ID.
        // If creating, we should just use setStudy directly on a new ID if we were creating a study,
        // but here we are in EventForm.
        // Standard flow: standard Create uses setEvent.
        // If user selected 'Study' on Create Event page:
        // We should probably just call setStudy with a new ID if creating.
        // However, EventForm is passed an event with an ID (even for create, see page.tsx using randomUUID)
        result = await setStudy(idToken, event.id, eventData)
      } else {
        // Normal Event Create/Update
        result = await setEvent(idToken, event.id, eventData)
      }

      if (result.success) {
        addToast({title: 'Success', description: result.message, color: 'success'})
        // Redirect based on destination type
        if (isMigration || values.typeFilter === 'Study') {
          return router.push('/admin/studies' as any)
        }
        return router.push('/admin/events')
      } else {
        addToast({title: 'Error', description: result.message, color: 'danger'})
      }
    } catch (error) {
      posthog.capture('error', {
        error: 'Failed to save event',
        message: getErrorMessage(error, 'Failed to save event'),
      })
      addToast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to save event'),
        color: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }

  // --- Dynamic Subtype Options ---
  const currentType = watch('typeFilter') // 'Event' or 'Study'
  const isEvent = currentType === 'Event'
  const isStudy = currentType === 'Study'

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
                field.value ? parseIsoToDateRange(field.value, Number(watch('duration'))) : null
              }
              onChange={(value: any) => {
                const {startIso, durationMinutes} = parseDateRangeToIso(value)
                field.onChange(startIso)
                if (durationMinutes !== null) {
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

        {/* Type Selection (Event vs Study) */}
        <Autocomplete
          label="Type"
          selectedKey={watch('typeFilter')}
          onSelectionChange={(key) => setValue('typeFilter', key as string, {shouldDirty: true})}
          isRequired>
          <AutocompleteItem key="Event">Event</AutocompleteItem>
          <AutocompleteItem key="Study">Study</AutocompleteItem>
        </Autocomplete>

        {/* Sub-type Selection */}
        <Autocomplete
          label="Sub-type"
          {...register('type')}
          selectedKey={watch('type')}
          onSelectionChange={(key) => setValue('type', key as string, {shouldDirty: true})}>
          {isEvent
            ? EVENT_SUBTYPES.map((t) => <AutocompleteItem key={t.key}>{t.label}</AutocompleteItem>)
            : STUDY_SUBTYPES.map((t) => <AutocompleteItem key={t.key}>{t.label}</AutocompleteItem>)}
        </Autocomplete>

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

      <Controller
        name="status"
        control={control}
        render={({field}) => (
          <div className="flex flex-col gap-2">
            <label className="text-small text-default-500">Status</label>
            <div className="bg-default-100 flex w-fit gap-2 rounded-lg p-1">
              <Button
                size="sm"
                variant={field.value === 'draft' ? 'solid' : 'light'}
                color={field.value === 'draft' ? 'primary' : 'default'}
                onPress={() => field.onChange('draft')}>
                Draft
              </Button>
              <Button
                size="sm"
                variant={field.value === 'published' ? 'solid' : 'light'}
                color={field.value === 'published' ? 'success' : 'default'}
                onPress={() => field.onChange('published')}>
                Posted
              </Button>
              <Button
                size="sm"
                variant={field.value === 'hidden' ? 'solid' : 'light'}
                color={field.value === 'hidden' ? 'warning' : 'default'}
                onPress={() => field.onChange('hidden')}>
                Hidden
              </Button>
            </div>
          </div>
        )}
      />

      <div className="flex justify-end gap-2">
        <Popover placement="top">
          <PopoverTrigger>
            <Button variant="flat" color="default">
              Cancel
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-4">
            <div className="flex flex-col gap-2">
              <p className="px-1 font-semibold">Leave without saving?</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={() => {
                    // Navigate back to the appropriate list based on current status (or default to events)
                    router.push('/admin/events')
                  }}>
                  Yes
                </Button>
                <Button
                  size="sm"
                  color="warning"
                  onPress={() => {
                    setValue('status', 'draft')
                    handleSubmit(onSubmit)()
                  }}>
                  Save this to draft
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button type="submit" color="primary" isLoading={loading || isUploadingPoster}>
          {event ? 'Update' : 'Create'}
        </Button>
      </div>
    </Form>
  )
}

// Helpers for Date Range (extracted for cleaner component)
function parseIsoToDateRange(isoStart: string, durationMinutes: number = 0): any {
  if (!isoStart) return null
  try {
    const start = parseDateTime(isoToLocalDateTimeInput(isoStart))
    const endIso = new Date(new Date(isoStart).getTime() + durationMinutes * 60000).toISOString()
    const end = parseDateTime(isoToLocalDateTimeInput(endIso))
    return {start, end}
  } catch (e) {
    return null
  }
}

function parseDateRangeToIso(value: any) {
  if (!value?.start) return {startIso: '', durationMinutes: null}
  const startIso = dateValueToISOString({
    year: value.start.year,
    month: value.start.month,
    day: value.start.day,
    hour: 'hour' in value.start ? value.start.hour : 0,
    minute: 'minute' in value.start ? value.start.minute : 0,
  })

  let durationMinutes = null
  if (value?.end && startIso) {
    const endIso = dateValueToISOString({
      year: value.end.year,
      month: value.end.month,
      day: value.end.day,
      hour: 'hour' in value.end ? value.end.hour : 0,
      minute: 'minute' in value.end ? value.end.minute : 0,
    })
    durationMinutes = Math.max(
      0,
      Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000)
    )
  }
  return {startIso, durationMinutes}
}
