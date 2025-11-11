import 'server-only'

import {getApp, initializeApp} from 'firebase-admin/app'
import {getAuth} from 'firebase-admin/auth'
import {FieldValue, getFirestore} from 'firebase-admin/firestore'
import {getStorage} from 'firebase-admin/storage'

let app
try {
  app = getApp()
} catch (error) {
  const {cert} = require('firebase-admin/app')
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  })
  getFirestore(app).settings({ignoreUndefinedProperties: true})
}

export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app)

export async function verifyAdminToken(token: string) {
  const decodedToken = await auth.verifyIdToken(token, true)
  if (!decodedToken.admin) {
    return {valid: false, message: 'Unauthorized', userId: decodedToken.uid}
  }
  return {valid: true, message: 'Authorized', userId: decodedToken.uid}
}

export type LOG_EVENT_TYPE =
  | 'create_event'
  | 'update_event'
  | 'delete_event'
  | 'move_event_photo'
  | 'delete_event_photo'
  | 'add_event_photo'
  | 'verify_admin_password'
  | 'step_down_as_admin'

// Helper function to serialize values for JSON (handles Firestore Timestamps, etc.)
function serializeForDiscord(value: any): any {
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
    return value.map(serializeForDiscord)
  }

  // Handle plain objects
  if (typeof value === 'object' && value.constructor === Object) {
    const serialized: any = {}
    for (const [key, val] of Object.entries(value)) {
      serialized[key] = serializeForDiscord(val)
    }
    return serialized
  }

  // Return primitives as-is
  return value
}

// Helper function to post log to Discord webhook
async function postLogToDiscord(
  event: LOG_EVENT_TYPE,
  userInfo: {uid: string; email?: string; displayName?: string},
  data: any
) {
  const webhookUrl = process.env.DISCORD_WEBSITE_LOG_WEBHOOK
  if (!webhookUrl) {
    return // Silently skip if webhook is not configured
  }

  try {
    // Map event types to emoji and color
    const eventConfig: Record<
      LOG_EVENT_TYPE,
      {emoji: string; color: number; label: string}
    > = {
      create_event: {emoji: '✨', color: 0x00ff00, label: 'Create Event'},
      update_event: {emoji: '📝', color: 0x0099ff, label: 'Update Event'},
      delete_event: {emoji: '🗑️', color: 0xff0000, label: 'Delete Event'},
      move_event_photo: {emoji: '🔄', color: 0xffaa00, label: 'Move Photo'},
      delete_event_photo: {emoji: '❌', color: 0xff5500, label: 'Delete Photo'},
      add_event_photo: {emoji: '📸', color: 0x00ff00, label: 'Add Photo'},
      verify_admin_password: {emoji: '🔐', color: 0x00ff00, label: 'Admin Login'},
      step_down_as_admin: {emoji: '👋', color: 0xffaa00, label: 'Admin Logout'},
    }

    const config = eventConfig[event]
    const timestamp = new Date().toISOString()

    // Format data for display (serialize first to handle Timestamps)
    let dataString = 'No additional data'
    if (data && Object.keys(data).length > 0) {
      try {
        const serializedData = serializeForDiscord(data)
        dataString = JSON.stringify(serializedData, null, 2)
        // Truncate if too long (Discord has limits)
        if (dataString.length > 1000) {
          dataString = dataString.substring(0, 1000) + '\n... (truncated)'
        }
      } catch {
        dataString = String(data)
      }
    }

    const embed = {
      title: `${config.emoji} ${config.label}`,
      color: config.color,
      fields: [
        {
          name: 'User',
          value: userInfo.displayName || userInfo.email || userInfo.uid,
          inline: true,
        },
        {
          name: 'Email',
          value: userInfo.email || 'N/A',
          inline: true,
        },
        {
          name: 'Event',
          value: event,
          inline: true,
        },
        {
          name: 'Details',
          value: `\`\`\`json\n${dataString}\n\`\`\``,
          inline: false,
        },
      ],
      timestamp,
      footer: {
        text: 'KDD Website Activity Log',
      },
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    })
  } catch (error) {
    // Silently fail - we don't want Discord errors to break logging
    console.error('Failed to post log to Discord:', error)
  }
}

export async function logUserActivity(uid: string, event: LOG_EVENT_TYPE, data: any) {
  const userInfo = await auth.getUser(uid)
  await firestore.collection('Logs').add({
    event,
    userInfo: userInfo.toJSON(),
    data,
    createdAt: FieldValue.serverTimestamp(),
  })

  // Post to Discord webhook (non-blocking)
  postLogToDiscord(event, {
    uid: userInfo.uid,
    email: userInfo.email,
    displayName: userInfo.displayName,
  }, data).catch((error) => {
    // Already handled in function, but catch here too for safety
    console.error('Discord webhook error:', error)
  })
}
