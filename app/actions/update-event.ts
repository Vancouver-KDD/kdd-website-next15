'use server'

import {Event} from '@/firebase/types'
import fs from 'fs'
import path from 'path'

const EVENTS_FILE_PATH = path.join(process.cwd(), 'app/events/events.json')

export async function updateEventParticipantCount(eventId: string, count: number) {
  try {
    const fileContent = fs.readFileSync(EVENTS_FILE_PATH, 'utf-8')
    const events: Event[] = JSON.parse(fileContent)

    const eventIndex = events.findIndex((e) => e.id === eventId)
    if (eventIndex === -1) {
      return {success: false, message: 'Event not found'}
    }

    // Update the quantity
    events[eventIndex].quantity = count

    // Write back to file
    fs.writeFileSync(EVENTS_FILE_PATH, JSON.stringify(events, null, 2))

    return {success: true, message: `Updated event ${eventId} count to ${count}`}
  } catch (error) {
    console.error('Error updating event:', error)
    return {success: false, message: 'Failed to update event'}
  }
}
