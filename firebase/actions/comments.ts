'use server'

import {firestore} from '@/firebase/server'
import {Comment} from '../types'
import {FieldValue, Timestamp} from 'firebase-admin/firestore'

export async function addComment(commentData: Omit<Comment, 'id' | 'createdAt'>) {
  try {
    const commentsRef = firestore.collection('comments')
    const docRef = await commentsRef.add({
      ...commentData,
      createdAt: FieldValue.serverTimestamp(),
    })
    return {success: true, id: docRef.id}
  } catch (error) {
    console.error('Error adding comment: ', error)
    return {success: false, error: 'Failed to add comment'}
  }
}

export async function getComments(targetId: string): Promise<Comment[]> {
  try {
    const commentsRef = firestore.collection('comments')
    const querySnapshot = await commentsRef
      .where('targetId', '==', targetId)
      .get()

    const comments: Comment[] = []
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data()
      // Fallback if createdAt hasn't been written fully by server timestamp yet
      const createdAtMillis = data.createdAt ? (data.createdAt as Timestamp).toMillis() : Date.now()
      const updatedAtMillis = data.updatedAt ? (data.updatedAt as Timestamp).toMillis() : undefined
      
      comments.push({
        id: docSnap.id,
        targetId: data.targetId,
        userId: data.userId,
        userDisplayName: data.userDisplayName,
        userPhotoURL: data.userPhotoURL,
        text: data.text,
        createdAt: createdAtMillis,
        updatedAt: updatedAtMillis,
        parentId: data.parentId,
        reactions: data.reactions || {},
      })
    })

    // Sort manually by createdAt descending to avoid requiring a specific composite Firestore index
    comments.sort((a, b) => b.createdAt - a.createdAt)

    return comments
  } catch (error) {
    console.error('Error getting comments: ', error)
    return []
  }
}

export async function deleteComment(commentId: string) {
  try {
    await firestore.collection('comments').doc(commentId).delete()
    return {success: true}
  } catch (error) {
    console.error('Error deleting comment: ', error)
    return {success: false, error: 'Failed to delete comment'}
  }
}

export async function editComment(commentId: string, newText: string) {
  try {
    await firestore.collection('comments').doc(commentId).update({
      text: newText,
      updatedAt: FieldValue.serverTimestamp()
    })
    return {success: true}
  } catch (error) {
    console.error('Error editing comment: ', error)
    return {success: false, error: 'Failed to edit comment'}
  }
}

export async function toggleCommentReaction(commentId: string, userId: string, emoji: string, isAdding: boolean) {
  try {
    const docRef = firestore.collection('comments').doc(commentId)
    if (isAdding) {
      await docRef.update({
        [`reactions.${emoji}`]: FieldValue.arrayUnion(userId)
      })
    } else {
      await docRef.update({
        [`reactions.${emoji}`]: FieldValue.arrayRemove(userId)
      })
    }
    return {success: true}
  } catch (error) {
    console.error('Error toggling reaction: ', error)
    return {success: false, error: 'Failed to update reaction'}
  }
}
