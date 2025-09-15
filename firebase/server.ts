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

export async function logUserActivity(uid: string, event: LOG_EVENT_TYPE, data: any) {
  const userInfo = await auth.getUser(uid)
  await firestore.collection('Logs').add({
    event,
    userInfo: userInfo.toJSON(),
    data,
    createdAt: FieldValue.serverTimestamp(),
  })
}
