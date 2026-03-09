'use server'

import {auth, firestore, storage} from '@/firebase/server'
import {FieldValue, Timestamp} from 'firebase-admin/firestore'
import {Comment} from '../types'

export interface UserProfile {
  uid: string
  displayName: string
  photoURL: string
  occupation?: string
}

// 1. Upload Profile Image
export async function uploadProfileImage(uid: string, formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) throw new Error('No file provided')

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const bucket = storage.bucket()
    const extension = file.name.split('.').pop()
    const filename = `avatars/${uid}-${Date.now()}.${extension}`
    const fileRef = bucket.file(filename)

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    })

    // Make public and get URL
    await fileRef.makePublic()
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

    return {success: true, url: publicUrl}
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return {success: false, error: 'Failed to upload image'}
  }
}

// 2. Update User Metadata (Auth & Comments & Profile)
export async function updateUserMetadata(
  uid: string,
  displayName: string,
  photoURL: string,
  occupation?: string
) {
  try {
    // A) Update Firebase Auth identity
    await auth.updateUser(uid, {
      displayName,
      photoURL,
    })

    // B) Update Custom Profile Document in Firestore
    const profileRef = firestore.collection('userProfiles').doc(uid)
    await profileRef.set(
      {
        uid,
        displayName,
        photoURL,
        occupation: occupation || '',
        updatedAt: FieldValue.serverTimestamp(),
      },
      {merge: true}
    )

    // C) Sync backwards to all historic comments written by the user
    const commentsRef = firestore.collection('comments')
    const userCommentsSnap = await commentsRef.where('userId', '==', uid).get()

    const batch = firestore.batch()
    userCommentsSnap.docs.forEach((doc) => {
      batch.update(doc.ref, {
        userDisplayName: displayName,
        userPhotoURL: photoURL,
      })
    })

    if (userCommentsSnap.docs.length > 0) {
      await batch.commit()
    }

    return {success: true}
  } catch (error) {
    console.error('Error updating profile metadata:', error)
    return {success: false, error: 'Failed to update profile'}
  }
}

// 3. Get User Activity (My Comments & Reacted Comments)
export async function getUserActivity(uid: string) {
  try {
    const commentsRef = firestore.collection('comments')

    // Query 1: Authored Comments
    const myCommentsSnap = await commentsRef.where('userId', '==', uid).get()

    // Query 2: We cannot do "array-contains" purely dynamically across all map keys in Firestore easily.
    // We fetch all recent comments and filter for reactions. For scaling, a dedicated `user_reactions` collection is better,
    // but for this scale we can pull the latest comments and parse.
    // Alternatively, since 'reacted' isn't explicitly indexed per user without a collection restructuring,
    // we'll fetch all comments (or a large chunk) to parse out the ones featuring the uid in ANY reaction payload.
    // To simplify and avoid large reads, we'll execute an efficient query tracking likes by relying on specific emoji arrays.

    // For now, let's query where the specific emojis array-contains uid.
    const emojis = ['👍', '❤️', '😄', '😢', '👏']
    const reactedCommentsMap = new Map<string, Comment>()

    for (const emoji of emojis) {
      const snap = await commentsRef.where(`reactions.${emoji}`, 'array-contains', uid).get()
      snap.docs.forEach((doc) => {
        const data = doc.data()
        if (!reactedCommentsMap.has(doc.id)) {
          reactedCommentsMap.set(doc.id, {
            id: doc.id,
            targetId: data.targetId,
            userId: data.userId,
            userDisplayName: data.userDisplayName,
            userPhotoURL: data.userPhotoURL,
            text: data.text,
            createdAt: data.createdAt ? (data.createdAt as Timestamp).toMillis() : Date.now(),
            updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toMillis() : undefined,
            parentId: data.parentId,
            reactions: data.reactions || {},
          })
        }
      })
    }

    const myComments: Comment[] = myCommentsSnap.docs
      .map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          targetId: data.targetId,
          userId: data.userId,
          userDisplayName: data.userDisplayName,
          userPhotoURL: data.userPhotoURL,
          text: data.text,
          createdAt: data.createdAt ? (data.createdAt as Timestamp).toMillis() : Date.now(),
          updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toMillis() : undefined,
          parentId: data.parentId,
          reactions: data.reactions || {},
        }
      })
      .sort((a, b) => b.createdAt - a.createdAt)

    const reactedComments = Array.from(reactedCommentsMap.values()).sort(
      (a, b) => b.createdAt - a.createdAt
    )

    return {
      success: true,
      myComments,
      reactedComments,
    }
  } catch (error) {
    console.error('Error fetching activity:', error)
    return {success: false, myComments: [], reactedComments: [], error: 'Failed to fetch activity'}
  }
}

// 4. Fetch User Profile (from Firestore)
export async function fetchUserProfile(uid: string) {
  try {
    const profileRef = firestore.collection('userProfiles').doc(uid)
    const doc = await profileRef.get()

    if (doc.exists) {
      const data = doc.data() as any
      return {
        success: true,
        profile: {
          ...data,
          updatedAt: data?.updatedAt ? data.updatedAt.toMillis() : undefined,
        } as UserProfile,
      }
    }
    return {success: true, profile: null}
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return {success: false, error: 'Failed to fetch profile'}
  }
}
