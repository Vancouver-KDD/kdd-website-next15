'use server'

import {firestore, logUserActivity, verifyAdminToken} from '@/firebase/server'
import {getErrorMessage} from '@/lib/utils'
import {FieldValue} from 'firebase-admin/firestore'
import {revalidatePath} from 'next/cache'
import type {Photo} from 'react-photo-album'

export async function moveEventToStudy(token: string, eventId: string) {
  const {valid, message, userId} = await verifyAdminToken(token)
  if (!valid) {
    return {success: false, message}
  }

  try {
    const eventRef = firestore.collection('Events').doc(eventId)
    const eventDoc = await eventRef.get()

    if (!eventDoc.exists) {
      return {success: false, message: 'Event not found'}
    }

    const eventData = eventDoc.data()
    const studyRef = firestore.collection('Studies').doc(eventId) // Keep same ID

    // Add to Studies collection
    await studyRef.set({
      ...eventData,
      type: 'Study', // Optionally tag it
    })

    // Delete from Events collection
    await eventRef.delete()

    // Log activity
    if (userId) {
      await logUserActivity(userId, 'move_event_to_study', {
        eventId,
        title: eventData?.title,
      })
    }

    revalidatePath('/events')
    revalidatePath('/study')
    revalidatePath(`/study/${eventId}`)

    return {success: true, message: `Moved "${eventData?.title}" to Studies`}
  } catch (error) {
    return {success: false, message: getErrorMessage(error, 'Failed to move event')}
  }
}

export async function moveStudyPhoto(
  token: string,
  studyId: string,
  oldIndex: number,
  newIndex: number
) {
  const {valid, message, userId} = await verifyAdminToken(token)
  if (!valid) {
    return {success: false, message}
  }
  const studyRef = firestore.collection('Studies').doc(studyId)
  try {
    const {arrayMove} = require('@/lib/utils')
    const {Transaction} = require('firebase-admin/firestore')
    await firestore.runTransaction(async (tx: typeof Transaction) => {
      const studyDoc = await tx.get(studyRef)
      const photos = studyDoc.data()?.photos || []
      const newPhotos = arrayMove(photos, oldIndex, newIndex)
      await tx.update(studyRef, {photos: newPhotos})
    })

    if (userId) {
      await logUserActivity(userId, 'move_study_photo', {
        studyId,
        oldIndex,
        newIndex,
      })
    }
  } catch (error) {
    return {success: false, message: getErrorMessage(error, 'Failed to move photo')}
  }
  revalidatePath(`/study/${studyId}`)
  return {success: true, message: 'Photo moved'}
}

export async function deleteStudyPhoto(token: string, studyId: string, photo: Photo) {
  const {valid, message, userId} = await verifyAdminToken(token)
  if (!valid) {
    return {success: false, message}
  }
  try {
    const {deletePhoto} = require('@/cloudinary/actions.server')
    await deletePhoto(photo.key as string)
  } catch (error) {
    return {success: false, message: getErrorMessage(error, 'Failed to delete photo')}
  }

  const studyRef = firestore.collection('Studies').doc(studyId)
  await studyRef.update({photos: FieldValue.arrayRemove(photo)})

  if (userId) {
    await logUserActivity(userId, 'delete_study_photo', {
      studyId,
      photoKey: photo.key,
      photoSrc: photo.src,
    })
  }

  revalidatePath(`/study/${studyId}`)
  return {success: true, message: 'Photo deleted'}
}

export async function deleteStudy(token: string, studyId: string) {
  const {valid, message, userId} = await verifyAdminToken(token)
  if (!valid) {
    return {success: false, message}
  }

  try {
    const studyRef = firestore.collection('Studies').doc(studyId)
    const studyDoc = await studyRef.get()
    const studyData = studyDoc.data()

    await studyRef.delete()

    if (userId) {
      await logUserActivity(userId, 'delete_study', {
        studyId,
        title: studyData?.title,
      })
    }

    revalidatePath('/study')
    return {success: true, message: 'Study deleted'}
  } catch (error) {
    return {success: false, message: getErrorMessage(error, 'Failed to delete study')}
  }
}
