import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const credential = cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
});

const app = initializeApp({ credential });
const auth = getAuth(app);
const db = getFirestore(app);

async function check() {
  try {
    const user = await auth.getUserByEmail('jane.yoonseol@gmail.com');
    // We only care about customClaims.admin
    console.log('Firebase Auth custom claims for Jane. admin =', user.customClaims?.admin);
  } catch(e) { console.log('not found in auth'); }

  const doc = await db.collection('admin_whitelist').doc('jane.yoonseol@gmail.com').get();
  console.log('Whitelist doc exists?', doc.exists);
  if (doc.exists) console.log(doc.data());
  
  process.exit(0);
}
check();
