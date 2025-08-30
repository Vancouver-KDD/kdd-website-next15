import {Timestamp} from 'firebase-admin/firestore'
import {firestore} from './app'
import {Event} from './types'

export async function getFutureEvents({
  limit = 100,
  currentDate = new Date(),
}: {limit?: number; currentDate?: Date} = {}) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return firestore
    .collection('Events')
    .where('date', '>=', Timestamp.fromDate(currentDate))
    .orderBy('date', 'asc')
    .limit(limit)
    .get()
    .then((snapshot) => {
      return snapshot.docs.map((doc) => {
        return {id: doc.id, ...doc.data()} as Event & {id: string}
      })
    })
}

import events from '@/app/events/events.json'

export async function getPastEvents({
  limit = 1000,
  currentDate = new Date(),
}: {limit?: number; currentDate?: Date} = {}) {
  return events.map((event) => ({
    ...event,
    date: Timestamp.fromDate(new Date(event.date)),
  }))
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
