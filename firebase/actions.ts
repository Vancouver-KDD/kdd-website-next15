'use server'
import {Timestamp} from 'firebase-admin/firestore'
import {firestore} from './app'
import events from '@/app/events/events.json'
import photos from '@/app/events/photos.json'
import type {Event} from './types'
import type {Photo} from 'react-photo-album'

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
        return {
          id: doc.id,
          ...eventData,
          date: eventData.date.toDate().toLocaleDateString('en-CA'),
          photos,
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

        return {
          id: doc.id,
          ...eventData,
          date: eventData.date.toDate().toLocaleDateString('en-CA'),
          photos,
        } as Event & {id: string}
      })
    })
  return [...firestoreEvents, ...events]
}

export async function getEvent(eventId: string) {
  // Find event from events.json
  const event = events.find((event) => event.id === eventId)
  if (!event) {
    return firestore
      .collection('Events')
      .doc(eventId)
      .get()
      .then((doc) => {
        const eventData = doc.data()
        if (!eventData) {
          return null
        }
        return {
          id: doc.id,
          ...eventData,
          date: eventData.date.toDate().toLocaleDateString('en-CA'),
        } as Event & {id: string}
      })
  }
  if (!event.photos || event.photos.length === 0) {
    ;(event as any).photos = photos as Photo[]
  }
  return event
}
