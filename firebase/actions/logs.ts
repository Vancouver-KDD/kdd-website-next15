'use server'

import {firestore, verifyAdminToken} from '@/firebase/server'
import {LOG_EVENT_TYPE} from '@/firebase/server'

export type LogEntry = {
  id: string
  event: LOG_EVENT_TYPE
  userInfo: {
    uid: string
    email?: string
    displayName?: string
  }
  data: any
  createdAt: Date
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
      return {
        id: doc.id,
        event: data.event,
        userInfo: {
          uid: data.userInfo?.uid || 'Unknown',
          email: data.userInfo?.email || 'No email',
          displayName: data.userInfo?.displayName || 'No name',
        },
        data: data.data || {},
        createdAt: data.createdAt?.toDate() || new Date(),
      }
    })

    return {success: true, logs}
  } catch (error) {
    console.error('Error fetching logs:', error)
    return {success: false, message: 'Failed to fetch logs'}
  }
}
