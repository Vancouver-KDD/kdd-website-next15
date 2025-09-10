'use server'

import {firestore} from '@/firebase/server'
import {verifyAdminToken} from '@/firebase/server'
import {v2 as cloudinary} from 'cloudinary'
import {revalidatePath} from 'next/cache'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadEventPhoto({
  token,
  eventId,
  imageData,
  fileName,
}: {
  token: string
  eventId: string
  imageData: string
  fileName: string
}) {
  try {
    const {valid, message} = await verifyAdminToken(token)
    if (!valid) {
      return {success: false, error: message}
    }

    if (!eventId || !imageData) {
      return {success: false, error: 'Missing required fields'}
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageData, {
      folder: `events/${eventId}`,
      name: fileName || `KDD_${Date.now()}`,
      resource_type: 'image',
      overwrite: false,
    })
    const newPhoto = {
      key: uploadResult.public_id,
      src: uploadResult.secure_url,
      alt: 'KDD photo ' + uploadResult.created_at,
      title: 'KDD photo ' + uploadResult.created_at,
      description: `Uploaded on ${uploadResult.created_at}`,
      width: uploadResult.width,
      height: uploadResult.height,
    }

    const eventRef = firestore.collection('Events').doc(eventId)
    await firestore.runTransaction(async (tx) => {
      const eventDoc = await tx.get(eventRef)
      if (!eventDoc.exists) {
        return {success: false, error: 'Event not found'}
      }
      const eventData = eventDoc.data()
      const photos = eventData?.photos || []
      photos.unshift(newPhoto)
      await tx.update(eventRef, {photos})
    })
    revalidatePath(`/events/${eventId}`)
    return {
      success: true,
      photo: newPhoto,
    }
  } catch (error) {
    return {success: false, error: 'Upload failed'}
  }
}
