'use server'
import {Timestamp} from 'firebase-admin/firestore'
import {firestore} from './app'
import {Event} from './types'

export async function getFutureEvents({
  limit = 100,
  currentDate = new Date(),
}: {limit?: number; currentDate?: Date} = {}) {
  return firestore
    .collection('Events')
    .where('date', '>=', Timestamp.fromDate(currentDate))
    .orderBy('date', 'asc')
    .limit(limit)
    .get()
    .then((snapshot) => {
      return snapshot.docs.map((doc) => {
        const eventData = doc.data()
        return {
          id: doc.id,
          ...eventData,
          date: eventData.date.toDate().toLocaleDateString('en-CA'),
        } as Event & {id: string}
      })
    })
}

import events from '@/app/events/events.json'

export async function getPastEvents({
  limit = 1000,
  currentDate = new Date(),
}: {limit?: number; currentDate?: Date} = {}) {
  return events
  //   await new Promise((resolve) => setTimeout(resolve, 1000))
  //   return firestore
  //     .collection('Events')
  //     .where('date', '<', Timestamp.fromDate(currentDate))
  //     .orderBy('date', 'desc')
  //     .limit(limit)
  //     .get()
  //     .then((snapshot) => {
  //       return snapshot.docs.map((doc) => {
  //         return {id: doc.id, ...doc.data()} as Event & {id: string}
  //       })
  //     })
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
  return event
}
