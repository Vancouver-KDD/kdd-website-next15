'use server'

import {firestore, LOG_EVENT_TYPE, verifyAdminToken} from '@/firebase/server'

export type LogEntry = {
  id: string
  event: LOG_EVENT_TYPE
  userInfo: {
    uid: string
    email?: string
    displayName?: string
  }
  data: any
  createdAt: string // ISO string for serialization
}

// Helper function to recursively convert Firestore Timestamps to serializable values
function serializeValue(value: any): any {
  if (value === null || value === undefined) {
    return value
  }

  // Handle Firestore Timestamp
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof value.toDate === 'function'
  ) {
    return value.toDate().toISOString()
  }

  // Handle Timestamp-like objects with _seconds
  if (value && typeof value === 'object' && '_seconds' in value) {
    const seconds = value._seconds || 0
    const nanoseconds = value._nanoseconds || 0
    return new Date(seconds * 1000 + nanoseconds / 1000000).toISOString()
  }

  // Handle Date objects
  if (value instanceof Date) {
    return value.toISOString()
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(serializeValue)
  }

  // Handle plain objects
  if (typeof value === 'object' && value.constructor === Object) {
    const serialized: any = {}
    for (const [key, val] of Object.entries(value)) {
      serialized[key] = serializeValue(val)
    }
    return serialized
  }

  // Return primitives as-is
  return value
}

export async function getLogs(token: string, limit: number = 100) {
  const {valid, message} = await verifyAdminToken(token)
  if (!valid) {
    return {success: false, message}
  }

  try {
    const logsSnapshot = await firestore
      .collection('Logs')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()

    const logs: LogEntry[] = logsSnapshot.docs.map((doc) => {
      const data = doc.data()

      // Convert createdAt to ISO string
      let createdAt: string
      if (data.createdAt) {
        if (data.createdAt.toDate && typeof data.createdAt.toDate === 'function') {
          createdAt = data.createdAt.toDate().toISOString()
        } else if (data.createdAt._seconds) {
          const seconds = data.createdAt._seconds || 0
          const nanoseconds = data.createdAt._nanoseconds || 0
          createdAt = new Date(seconds * 1000 + nanoseconds / 1000000).toISOString()
        } else if (data.createdAt instanceof Date) {
          createdAt = data.createdAt.toISOString()
        } else {
          createdAt = new Date().toISOString()
        }
      } else {
        createdAt = new Date().toISOString()
      }

      return {
        id: doc.id,
        event: data.event,
        userInfo: {
          uid: data.userInfo?.uid || 'Unknown',
          email: data.userInfo?.email || 'No email',
          displayName: data.userInfo?.displayName || 'No name',
        },
        data: serializeValue(data.data || {}),
        createdAt,
      }
    })

    return {success: true, logs}
  } catch (error) {
    console.error('Error fetching logs:', error)
    return {success: false, message: 'Failed to fetch logs'}
  }
}
