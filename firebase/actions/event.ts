'use server'
import {addSrcSetToPhoto} from '@/cloudinary/utils'
import {firestore} from '@/firebase/server'
import type {Event} from '@/firebase/types'
import {Timestamp} from 'firebase-admin/firestore'
import type {Photo} from 'react-photo-album'

export async function getFutureEvents() {
  return firestore
    .collection('Events')
    .where('date', '>=', Timestamp.now())
    .orderBy('date', 'asc')
    .get()
    .then((snapshot) => {
      return snapshot.docs
        .map((doc) => {
          const eventData = doc.data()
          if (eventData.draft) {
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
        })
        .filter((event) => event !== null)
    })
}

export async function getPastEvents() {
  const firestoreEvents = await firestore
    .collection('Events')
    .where('date', '<', Timestamp.now())
    .orderBy('date', 'desc')
    .get()
    .then((snapshot) => {
      return snapshot.docs
        .map((doc) => {
          const eventData = doc.data()
          if (eventData.draft) {
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
        })
        .filter((event) => event !== null)
    })
  return firestoreEvents
}

export async function getEvent(eventId: string) {
  return firestore
    .collection('Events')
    .doc(eventId)
    .get()
    .then((doc) => {
      const eventData = doc.data()
      if (!eventData || eventData.draft) {
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
    })
}
