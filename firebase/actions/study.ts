'use server'
import {addSrcSetToPhoto} from '@/cloudinary/utils'
import {firestore} from '@/firebase/server'
import type {Event} from '@/firebase/types'
import {Timestamp} from 'firebase-admin/firestore'
import type {Photo} from 'react-photo-album'

export async function getFutureStudies() {
  return firestore
    .collection('Studies')
    .where('date', '>=', Timestamp.now())
    .orderBy('date', 'asc')
    .get()
    .then((snapshot) => {
      return snapshot.docs
        .map((doc) => {
          const studyData = doc.data()
          if (studyData.draft) {
            return null
          }

          const photos =
            studyData.photos?.map((photo: Photo) =>
              addSrcSetToPhoto(photo, process.env.CLOUDINARY_CLOUD_NAME!)
            ) || []

          return {
            id: doc.id,
            ...studyData,
            photos,
            date: studyData.date.toDate().toISOString(),
          } as Event & {id: string}
        })
        .filter((study) => study !== null)
    })
}

export async function getPastStudies() {
  const firestoreStudies = await firestore
    .collection('Studies')
    .where('date', '<', Timestamp.now())
    .orderBy('date', 'desc')
    .get()
    .then((snapshot) => {
      return snapshot.docs
        .map((doc) => {
          const studyData = doc.data()
          if (studyData.draft) {
            return null
          }
          const photos =
            studyData.photos?.map((photo: Photo) =>
              addSrcSetToPhoto(photo, process.env.CLOUDINARY_CLOUD_NAME!)
            ) || []

          return {
            id: doc.id,
            ...studyData,
            photos,
            date: studyData.date.toDate().toISOString(),
          } as Event & {id: string}
        })
        .filter((study) => study !== null)
    })
  return firestoreStudies
}

export async function getStudy(studyId: string) {
  return firestore
    .collection('Studies')
    .doc(studyId)
    .get()
    .then((doc) => {
      const studyData = doc.data()
      if (!studyData || studyData.draft) {
        return null
      }

      const photos =
        studyData.photos?.map((photo: Photo) =>
          addSrcSetToPhoto(photo, process.env.CLOUDINARY_CLOUD_NAME!)
        ) || []

      return {
        id: doc.id,
        ...studyData,
        photos,
        date: studyData.date.toDate().toISOString(),
      } as Event & {id: string}
    })
}
