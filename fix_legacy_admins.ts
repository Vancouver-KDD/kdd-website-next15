import {cert, initializeApp} from 'firebase-admin/app'
import {getAuth} from 'firebase-admin/auth'
import {FieldValue, getFirestore} from 'firebase-admin/firestore'

const credential = cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
})

const app = initializeApp({credential})
const auth = getAuth(app)
const db = getFirestore(app)

async function migrate() {
  const users = await auth.listUsers()
  const adminsByAuth = users.users.filter(
    (u) => u.customClaims?.admin === true || u.email === 'vancouverkdd@gmail.com'
  )

  const wl = await db.collection('admin_whitelist').get()
  const wlEmails = wl.docs.map((d) => d.id)

  for (const user of adminsByAuth) {
    if (user.email && !wlEmails.includes(user.email.toLowerCase().trim())) {
      console.log(`Migrating missing legacy admin: ${user.email}`)
      await db.collection('admin_whitelist').doc(user.email.toLowerCase().trim()).set({
        addedBy: 'System Legacy Migration',
        addedAt: FieldValue.serverTimestamp(),
        email: user.email.toLowerCase().trim(),
      })
      console.log('Migrated.')
    }
  }
  process.exit(0)
}
migrate()
