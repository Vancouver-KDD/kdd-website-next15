const { initializeApp, cert, getApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// Manually load .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
  });
}

let app;
try {
  app = getApp();
} catch (error) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    }),
  });
}

const firestore = getFirestore(app);

const itemsToMove = [
  'KDD LeetCode 인터뷰 스터디 2기',
  '11월 릴레이 멘토링 프로그램',
  '[모집 마감] KDD 영어 인터뷰 스터디: 2기',
];

async function migrate() {
  console.log('Starting migration...');
  const eventsRef = firestore.collection('Events');
  const studiesRef = firestore.collection('Studies');

  for (const title of itemsToMove) {
    console.log(`Searching for: "${title}"`);
    const snapshot = await eventsRef.where('title', '==', title).get();

    if (snapshot.empty) {
      console.log(`No event found with title: "${title}"`);
      continue;
    }

    for (const doc of snapshot.docs) {
      const data = doc.data();
      console.log(`Moving: ${doc.id} - ${data.title}`);

      await studiesRef.doc(doc.id).set({
        ...data,
        type: 'Study',
      });

      await eventsRef.doc(doc.id).delete();
      console.log(`Successfully moved ${doc.id}`);
    }
  }
  console.log('Migration finished.');
}

migrate().catch(console.error);
