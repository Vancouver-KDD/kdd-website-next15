const {initializeApp, cert} = require('firebase-admin/app')
const {getFirestore} = require('firebase-admin/firestore')
require('dotenv').config({path: '.env.local'})

const credential = cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
})

const app = initializeApp({credential})
const db = getFirestore(app)

async function check() {
  const reqs = await db.collection('admin_requests').get()
  console.log('Admin Requests:')
  reqs.forEach((d) => console.log(d.id, d.data()))

  const profiles = await db.collection('userProfiles').get()
  console.log('\nUser Profiles:')
  profiles.forEach((d) => console.log(d.id, d.data()))

  process.exit(0)
}

check().catch((e) => {
  console.error(e)
  process.exit(1)
})
