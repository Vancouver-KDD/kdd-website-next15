'use server'
import {Timestamp, Transaction, FieldValue} from 'firebase-admin/firestore'
import {firestore} from '../app'
import type {Event} from '../types'
import type {Photo} from 'react-photo-album'
import {revalidatePath} from 'next/cache'
import {arrayMove, getErrorMessage} from '@/lib/utils'
import {verifyAdminToken} from '../utils'
import {v2 as cloudinary} from 'cloudinary'
import {addSrcSetToPhoto} from '@/cloudinary/utils'

export async function getFutureEvents({
  currentDate = new Date(),
}: {limit?: number; currentDate?: Date} = {}) {
  return firestore
    .collection('Events')
    .where('date', '>=', Timestamp.fromDate(currentDate))
    .orderBy('date', 'asc')
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
          date: eventData.date.toDate().toLocaleDateString('en-CA'),
        } as Event & {id: string}
      })
    })
}

export async function getPastEvents({
  currentDate = new Date(),
}: {limit?: number; currentDate?: Date} = {}) {
  const firestoreEvents = await firestore
    .collection('Events')
    .where('date', '<', Timestamp.fromDate(currentDate))
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
          date: eventData.date.toDate().toLocaleDateString('en-CA'),
        } as Event & {id: string}
      })
    })
  return firestoreEvents
}

export async function getEvent(eventId: string) {
  // Find event from events.json
  return firestore
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
        date: eventData.date.toDate().toLocaleDateString('en-CA'),
      } as Event & {id: string}
    })
}

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
    await cloudinary.uploader.destroy(photo.key as string)
  } catch (error) {
    return {success: false, message: getErrorMessage(error, 'Failed to delete photo')}
  }

  const eventRef = firestore.collection('Events').doc(eventId)
  await eventRef.update({photos: FieldValue.arrayRemove(photo)})
  revalidatePath(`/events/${eventId}`)
  return {success: true, message: 'Photo deleted'}
}
