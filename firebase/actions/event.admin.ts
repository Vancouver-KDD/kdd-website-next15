'use server'

import {getErrorMessage} from '@/lib/utils'
import {firestore, verifyAdminToken} from '@/firebase/server'
import {arrayMove} from '@/lib/utils'
import {FieldValue, Timestamp, Transaction} from 'firebase-admin/firestore'
import {posthog} from 'posthog-js'
import {revalidatePath} from 'next/cache'
import {deleteEventPhotos, deletePhoto} from '@/cloudinary/actions.server'
import {Photo} from 'react-photo-album/dist/types'
import {Event} from '@/firebase/types'
import {addSrcSetToPhoto} from '@/cloudinary/utils'

export async function moveEventPhoto(
  token: string,
  eventId: string,
  oldIndex: number,
  newIndex: number
) {
  const {valid, message} = await verifyAdminToken(token)
  if (!valid) {
    return {success: false, message}
  }
  const eventRef = firestore.collection('Events').doc(eventId)
  try {
    await firestore.runTransaction(async (tx: Transaction) => {
      const eventDoc = await tx.get(eventRef)
      const photos = eventDoc.data()?.photos || []
      const newPhotos = arrayMove(photos, oldIndex, newIndex)
      await tx.update(eventRef, {photos: newPhotos})
    })
  } catch (error) {
    posthog.capture('error', {
      error: 'Failed to move photo',
      message: getErrorMessage(error, 'Failed to move photo'),
    })
    return {success: false, message: getErrorMessage(error, 'Failed to move photo')}
  }
  revalidatePath(`/events/${eventId}`)
  return {success: true, message: 'Photo moved'}
}

export async function deleteEventPhoto(token: string, eventId: string, photo: Photo) {
  const {valid, message} = await verifyAdminToken(token)
  if (!valid) {
    return {success: false, message}
  }
  try {
    await deletePhoto(photo.key as string)
  } catch (error) {
    posthog.capture('error', {
      error: 'Failed to delete photo',
      message: getErrorMessage(error, 'Failed to delete photo'),
    })
    return {success: false, message: getErrorMessage(error, 'Failed to delete photo')}
  }

  const eventRef = firestore.collection('Events').doc(eventId)
  await eventRef.update({photos: FieldValue.arrayRemove(photo)})
  revalidatePath(`/events/${eventId}`)
  return {success: true, message: 'Photo deleted'}
}

export async function createEvent(token: string, eventData: Omit<Event, 'id'>) {
  const {valid, message} = await verifyAdminToken(token)
  if (!valid) {
    return {success: false, message}
  }

  if (!eventData.date) {
    return {success: false, message: 'Date is required'}
  }

  try {
    // Convert date string to Timestamp
    const eventWithTimestamp = {
      ...eventData,
      date: Timestamp.fromDate(new Date(eventData.date)),
    }

    const docRef = await firestore.collection('Events').add(eventWithTimestamp)
    revalidatePath('/events')
    revalidatePath('/admin/events')
    return {success: true, message: 'Event created', eventId: docRef.id}
  } catch (error) {
    posthog.capture('error', {
      error: 'Failed to create event',
      message: getErrorMessage(error, 'Failed to create event'),
    })
    return {success: false, message: getErrorMessage(error, 'Failed to create event')}
  }
}

export async function updateEvent(
  token: string,
  eventId: string,
  eventData: Partial<Omit<Event, 'id'>>
) {
  const {valid, message} = await verifyAdminToken(token)
  if (!valid) {
    return {success: false, message}
  }

  try {
    const updateData: any = {...eventData}

    // Convert date string to Timestamp
    updateData.date = Timestamp.fromDate(new Date(eventData.date as string))

    await firestore.collection('Events').doc(eventId).update(updateData)
    revalidatePath('/events')
    revalidatePath(`/events/${eventId}`)
    return {success: true, message: 'Event updated'}
  } catch (error) {
    posthog.capture('error', {
      error: 'Failed to update event',
      message: getErrorMessage(error, 'Failed to update event'),
    })
    return {success: false, message: getErrorMessage(error, 'Failed to update event')}
  }
}

export async function deleteEvent(token: string, eventId: string) {
  const {valid, message} = await verifyAdminToken(token)
  if (!valid) {
    return {success: false, message}
  }

  try {
    try {
      await deleteEventPhotos(eventId)
    } catch (error) {
      console.warn('Failed to delete event from Cloudinary:', error)
      posthog.capture('error', {
        error: 'Failed to delete event from Cloudinary',
        message: getErrorMessage(error, 'Failed to delete event from Cloudinary'),
      })
    }

    // Then delete the event document
    await firestore.collection('Events').doc(eventId).delete()
    revalidatePath('/events')
    return {success: true, message: 'Event deleted'}
  } catch (error) {
    posthog.capture('error', {
      error: 'Failed to delete event',
      message: getErrorMessage(error, 'Failed to delete event'),
    })
    return {success: false, message: getErrorMessage(error, 'Failed to delete event')}
  }
}

export async function getEvents() {
  return firestore
    .collection('Events')
    .orderBy('date', 'desc')
    .get()
    .then((snapshot) => {
      return snapshot.docs.map((doc) => {
        const eventData = doc.data()
        // Add srcSet to photos if they exist
        const photos =
          eventData.photos?.map((photo: Photo) =>
            addSrcSetToPhoto(photo, process.env.CLOUDINARY_CLOUD_NAME!)
          ) || []

        return {
          id: doc.id,
          ...eventData,
          photos,
          date: eventData.date.toDate().toISOString(), // Preserve date and time as ISO string
        } as Event & {id: string}
      })
    })
}
