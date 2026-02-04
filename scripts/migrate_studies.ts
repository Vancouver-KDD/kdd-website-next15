import {firestore} from '../firebase/server'

const itemsToMove = [
  'KDD LeetCode 인터뷰 스터디 2기',
  '11월 릴레이 멘토링 프로그램',
  '[모집 마감] KDD 영어 인터뷰 스터디: 2기',
]

async function migrate() {
  console.log('Starting migration...')
  const eventsRef = firestore.collection('Events')
  const studiesRef = firestore.collection('Studies')

  for (const title of itemsToMove) {
    console.log(`Searching for: "${title}"`)
    const snapshot = await eventsRef.where('title', '==', title).get()

    if (snapshot.empty) {
      console.log(`No event found with title: "${title}"`)
      continue
    }

    for (const doc of snapshot.docs) {
      const data = doc.data()
      console.log(`Moving: ${doc.id} - ${data.title}`)

      await studiesRef.doc(doc.id).set({
        ...data,
        type: 'Study',
      })

      await eventsRef.doc(doc.id).delete()
      console.log(`Successfully moved ${doc.id}`)
    }
  }
  console.log('Migration finished.')
}

migrate().catch(console.error)
