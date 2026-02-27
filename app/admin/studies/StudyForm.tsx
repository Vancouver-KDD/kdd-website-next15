'use client'

import {PosterDropzone} from '@/app/admin/events/PosterDropzone'
import {deleteStudyPoster, uploadStudyPoster} from '@/cloudinary/actions.admin'
import {setStudy, moveEventToStudy} from '@/firebase/actions/study.admin'
import {setEvent, moveStudyToEvent} from '@/firebase/actions/event.admin' 
// Wait, I clarified this in EventForm.
// moveStudyToEvent -> event.admin.ts
// moveEventToStudy -> study.admin.ts
import {useAuthStore} from '@/firebase/AuthClient'
import type {Event} from '@/firebase/types'
import {dateValueToISOString, getErrorMessage, isoToLocalDateTimeInput} from '@/lib/utils'
import {EVENT_SUBTYPES, STUDY_SUBTYPES} from '@/lib/constants'
import {Autocomplete, AutocompleteItem} from '@heroui/autocomplete'
import {Button} from '@heroui/button'
import {Checkbox} from '@heroui/checkbox'
import {DateRangePicker} from '@heroui/date-picker'
import {Form} from '@heroui/form'
import {Popover, PopoverContent, PopoverTrigger} from '@heroui/popover'
// import {Radio, RadioGroup} from '@heroui/radio' // Failed import
import {Input, Textarea} from '@heroui/input'
import {NumberInput} from '@heroui/number-input'
import {addToast} from '@heroui/toast'
import {parseDateTime} from '@internationalized/date'
import {useRouter} from 'next/navigation'
import posthog from 'posthog-js'
import {useEffect, useState} from 'react'
import {Controller, useForm} from 'react-hook-form'

export type StudyFormValues = {
  title: string
  date: string
  endDate?: string
  isOngoing: boolean
  // draft?: boolean // Deprecated
  status: 'draft' | 'published' | 'hidden'
  location?: string
  description?: string
  quantity?: string
  image?: string
  typeFilter: string
  type?: string
}

export function StudyForm({study}: {study: Event & {id: string}}) {
  const router = useRouter()
  const {user} = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [isUploadingPoster, setIsUploadingPoster] = useState(false)

  const form = useForm<StudyFormValues>({
    defaultValues: {
      title: '',
      date: '',
      endDate: '',
      isOngoing: false,
      status: 'draft',
      location: '',
      description: '',
      quantity: '',
      image: '',
      typeFilter: 'Study',
      type: '',
    },
  })
  const {register, handleSubmit, watch, setValue, control} = form
  const imageUrl = watch('image')

  useEffect(() => {
    if (study) {
      let status: 'draft' | 'published' | 'hidden' = 'published'
      if (study.status) {
        status = study.status
      } else if (study.draft) {
        status = 'hidden'
      }

      form.reset({
        title: study.title || '',
        date: study.date || '',
        endDate: study.endDate || '',
        isOngoing: study.isOngoing || false,
        status,
        location: study.location || '',
        description: study.description || '',
        quantity: study.quantity?.toString() || '',
        image: study.image || '',
        type: study.type || 'STUDY GROUP',
      })
    }
  }, [study, form.reset])

  const handlePosterFile = async (file: File) => {
    const studyId = study.id
    if (!user || !studyId) {
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
      const res = await uploadStudyPoster({
        token: idToken,
        studyId: studyId,
        imageData: dataUrl,
      })
      if (res.success) {
        addToast({
          title: 'Poster uploaded',
          description: `Poster ${study ? 'updated' : 'attached'}`,
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
    const studyId = study.id
    if (!user || !studyId) return
    const token = await user.getIdToken()
    const res = await deleteStudyPoster({token, studyId: studyId})
    if (res.success) {
      addToast({
        title: 'Poster removed',
        description: 'Poster deleted',
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

  const onSubmit = async (values: StudyFormValues) => {
    if (!user) return
    setLoading(true)
    try {
      const idToken = await user.getIdToken()
      const studyData = {
        ...values,
        quantity: values.quantity ? parseInt(values.quantity) : undefined,
        draft: values.status === 'hidden' || values.status === 'draft',
      }
      delete (studyData as any).typeFilter

      let result
      const isMigration = values.typeFilter === 'Event'

      if (isMigration && study.id) {
          // Migrating Study -> Event
          // 1. Move it
           const {moveStudyToEvent} = await import('@/firebase/actions/event.admin')
           const moveRes = await moveStudyToEvent(idToken, study.id)
           if (!moveRes.success) throw new Error(moveRes.message)

          // 2. Update new event
           const {setEvent} = await import('@/firebase/actions/event.admin')
           result = await setEvent(idToken, study.id, studyData)
      } else if (isMigration && !study.id) {
          // Create new Event from Study Form
           const {setEvent} = await import('@/firebase/actions/event.admin')
           result = await setEvent(idToken, study.id, studyData)
      } else {
          // Normal Study Update
          result = await setStudy(idToken, study.id, studyData)
      }

      if (result.success) {
        addToast({title: 'Success', description: result.message, color: 'success'})
        if (isMigration || values.typeFilter === 'Event') {
            return router.push('/admin/events')
        }
        return router.push('/admin/studies' as any)
      } else {
        addToast({title: 'Error', description: result.message, color: 'danger'})
      }
    } catch (error) {
      posthog.capture('error', {
        error: 'Failed to set study',
        message: getErrorMessage(error, 'Failed to set study'),
      })
      addToast({
        title: 'Error',
        description: `Failed to ${study ? 'update' : 'create'} study`,
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
              aria-label="Date"
              label="Date"
              popoverProps={{isNonModal: true}}
              value={field.value ? parseIsoToDateRange(field.value, watch('endDate')) : null}
              onChange={(value: any) => {
                const {startIso, endIso} = parseDateRangeToIso(value)
                field.onChange(startIso)
                setValue('endDate', endIso, {shouldDirty: true})
              }}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />
        
        <div className="flex items-center mt-2 col-span-1 md:col-span-2">
          <Controller
            name="isOngoing"
            control={control}
            render={({field}) => (
              <Checkbox
                isSelected={field.value}
                onValueChange={field.onChange}
              >
                <span className="text-sm">This is an ongoing study. This overrides the dates to automatically put it in the Ongoing Studies section.</span>
              </Checkbox>
            )}
          />
        </div>

        <Input label="Location" {...register('location')} />
        
        {/* Type Selection (Event vs Study) */}
        <Autocomplete 
            label="Type" 
            selectedKey={watch('typeFilter')}
            onSelectionChange={(key) => setValue('typeFilter', key as string, {shouldDirty: true})}
            isRequired
        >
           <AutocompleteItem key="Event">Event</AutocompleteItem>
           <AutocompleteItem key="Study">Study</AutocompleteItem>
        </Autocomplete>

        {/* Sub-type Selection */}
        <Autocomplete 
            label="Sub-type" 
            {...register('type')}
            selectedKey={watch('type')}
            onSelectionChange={(key) => setValue('type', key as string, {shouldDirty: true})}
        >
            {isEvent 
                ? EVENT_SUBTYPES.map((t) => <AutocompleteItem key={t.key}>{t.label}</AutocompleteItem>)
                : STUDY_SUBTYPES.map((t) => <AutocompleteItem key={t.key}>{t.label}</AutocompleteItem>)
            }
        </Autocomplete>

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
      </div>
      <Textarea label="Description" {...register('description')} rows={4} />
      
      <Controller
        name="status"
        control={control}
        render={({field}) => (
            <div className="flex flex-col gap-2">
                <label className="text-small text-default-500">Status</label>
                <div className="flex gap-2 p-1 bg-default-100 rounded-lg w-fit">
                    <Button 
                        size="sm"
                        variant={field.value === 'draft' ? 'solid' : 'light'}
                        color={field.value === 'draft' ? 'primary' : 'default'}
                        onPress={() => field.onChange('draft')}
                    >
                        Draft
                    </Button>
                    <Button 
                        size="sm"
                        variant={field.value === 'published' ? 'solid' : 'light'}
                        color={field.value === 'published' ? 'success' : 'default'}
                        onPress={() => field.onChange('published')}
                    >
                        Posted
                    </Button>
                    <Button 
                        size="sm"
                        variant={field.value === 'hidden' ? 'solid' : 'light'}
                        color={field.value === 'hidden' ? 'warning' : 'default'}
                        onPress={() => field.onChange('hidden')}
                    >
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
              <p className="font-semibold px-1">Leave without saving?</p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="flat" 
                  color="danger" 
                  onPress={() => router.push('/admin/studies' as any)}
                >
                  Yes
                </Button>
                <Button 
                  size="sm" 
                  color="warning" 
                  onPress={() => {
                    setValue('status', 'draft')
                    handleSubmit(onSubmit)()
                  }}
                >
                  Save this to draft
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button type="submit" color="primary" isLoading={loading || isUploadingPoster}>
          {study ? 'Update' : 'Create'}
        </Button>
      </div>
    </Form>
  )
}

// Helpers
function parseIsoToDateRange(isoStart: string, isoEnd?: string): any {
    if (!isoStart) return null
    try {
        const start = parseDateTime(isoToLocalDateTimeInput(isoStart))
        const end = isoEnd ? parseDateTime(isoToLocalDateTimeInput(isoEnd)) : start
        return {start, end}
    } catch (e) {
        return null
    }
}

function parseDateRangeToIso(value: any) {
    if (!value?.start) return {startIso: '', endIso: ''}
    const startIso = dateValueToISOString({
        year: value.start.year,
        month: value.start.month,
        day: value.start.day,
        hour: 'hour' in value.start ? value.start.hour : 0,
        minute: 'minute' in value.start ? value.start.minute : 0,
    })
    let endIso = ''
    if (value.end) {
        endIso = dateValueToISOString({
            year: value.end.year,
            month: value.end.month,
            day: value.end.day,
            hour: 'hour' in value.end ? value.end.hour : 0,
            minute: 'minute' in value.end ? value.end.minute : 0,
        })
    }
    return {startIso, endIso}
}
