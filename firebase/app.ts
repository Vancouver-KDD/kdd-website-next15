import {getApp, initializeApp} from 'firebase-admin/app'
import {getAuth} from 'firebase-admin/auth'
import {getFirestore} from 'firebase-admin/firestore'
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
}

export const auth = getAuth(app)

// Initialize Firestore and apply settings immediately
const firestoreInstance = getFirestore(app)
firestoreInstance.settings({ignoreUndefinedProperties: true})
export const firestore = firestoreInstance

export const storage = getStorage(app)
