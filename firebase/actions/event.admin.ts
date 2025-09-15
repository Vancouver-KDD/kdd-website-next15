'use server'

import {deleteEventPhotos, deletePhoto} from '@/cloudinary/actions.server'
import {addSrcSetToPhoto} from '@/cloudinary/utils'
import {firestore, logUserActivity, verifyAdminToken} from '@/firebase/server'
import {Event} from '@/firebase/types'
import {arrayMove, filterMeaningfulFields, getErrorMessage, getObjectDiff} from '@/lib/utils'
import {FieldValue, Timestamp, Transaction} from 'firebase-admin/firestore'
import {revalidatePath} from 'next/cache'
import {posthog} from 'posthog-js'
import {Photo} from 'react-photo-album/dist/types'

export async function moveEventPhoto(
  token: string,
  eventId: string,
  oldIndex: number,
  newIndex: number
) {
  const {valid, message, userId} = await verifyAdminToken(token)
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

    // Log user activity
    if (userId) {
      await logUserActivity(userId, 'move_event_photo', {
        eventId,
        oldIndex,
        newIndex,
      })
    }
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
  const {valid, message, userId} = await verifyAdminToken(token)
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

  // Log user activity
  if (userId) {
    await logUserActivity(userId, 'delete_event_photo', {
      eventId,
      photoKey: photo.key,
      photoSrc: photo.src,
    })
  }

  revalidatePath(`/events/${eventId}`)
  return {success: true, message: 'Photo deleted'}
}

export async function setEvent(
  token: string,
  eventId: string,
  eventData: Partial<Omit<Event, 'id'>>
) {
  const {valid, message, userId} = await verifyAdminToken(token)
  if (!valid) {
    return {success: false, message}
  }

  try {
    const updateData: any = {...eventData}

    // Convert date string to Timestamp
    if (eventData.date) {
      updateData.date = Timestamp.fromDate(new Date(eventData.date as string))
    }

    // Get existing event data for comparison
    const eventRef = firestore.collection('Events').doc(eventId)
    const existingEventDoc = await eventRef.get()
    const isCreate = !existingEventDoc.exists
    const existingData = existingEventDoc.data() || {}

    await eventRef.set(updateData)

    // Log user activity
    if (isCreate) {
      // For create: only log meaningful fields
      const createData = {
        eventId,
        ...filterMeaningfulFields(eventData),
      }
      await logUserActivity(userId, 'create_event', createData)
    } else {
      // For update: find and log differences
      const changes = getObjectDiff(existingData, eventData)

      // Only log if there are actual changes
      if (Object.keys(changes).length > 0) {
        await logUserActivity(userId, 'update_event', {eventId, ...changes})
      }
    }

    if (eventData && eventData.date && new Date(eventData.date) > Timestamp.now().toDate()) {
      // Upcoming event must be revalidated on home page
      revalidatePath('/')
    }

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
  const {valid, message, userId} = await verifyAdminToken(token)
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

    // Get event data before deletion
    const eventDocRef = firestore.collection('Events').doc(eventId)
    const eventData = await eventDocRef.get().then((doc) => doc.data())

    // Then delete the event document
    await eventDocRef.delete()

    // Log user activity
    await logUserActivity(userId, 'delete_event', {
      eventId,
      ...eventData,
    })

    revalidatePath('/events')

    if (eventData?.date > Timestamp.now()) {
      // Upcoming event must be revalidated on home page
      revalidatePath('/')
    }

    return {success: true, message: 'Event deleted'}
  } catch (error) {
    posthog.capture('error', {
      error: 'Failed to delete event',
      message: getErrorMessage(error, 'Failed to delete event'),
    })
    return {success: false, message: getErrorMessage(error, 'Failed to delete event')}
  }
}

export async function getEvents(token: string) {
  const {valid, message} = await verifyAdminToken(token)
  if (!valid) {
    return {success: false, message}
  }
  return {
    success: true,
    events: await firestore
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
      }),
  }
}

export async function getEvent(token: string, eventId: string) {
  const {valid, message} = await verifyAdminToken(token)
  if (!valid) {
    return {success: false, message}
  }
  return {
    success: true,
    event: await firestore
      .collection('Events')
      .doc(eventId)
      .get()
      .then((doc) => {
        const eventData = doc.data()
        if (!eventData) {
          return null
        }

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
      }),
  }
}
