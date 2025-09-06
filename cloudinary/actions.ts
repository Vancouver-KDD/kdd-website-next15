import {firestore} from '@/firebase/app'
import {v2 as cloudinary} from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadEventPhoto({
  password,
  eventId,
  imageData,
  fileName,
}: {
  password: string
  eventId: string
  imageData: string
  fileName: string
}) {
  try {
    // Simple password check
    if (password !== process.env.KDD_ADMIN_PASSWORD) {
      return {success: false, error: 'Unauthorized'}
    }

    if (!eventId || !imageData) {
      return {success: false, error: 'Missing required fields'}
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageData, {
      folder: `kdd-events/${eventId}`,
      public_id: fileName || `photo_${Date.now()}`,
      resource_type: 'image',
    })

    // Store photo URL in Firestore
    const eventRef = firestore.collection('Events').doc(eventId)
    const eventDoc = await eventRef.get()

    if (!eventDoc.exists) {
      return {success: false, error: 'Event not found'}
    }

    const eventData = eventDoc.data()
    const photos = eventData?.photos || []

    // Add new photo to the array in the correct format for react-photo-album
    const newPhoto = {
      key: uploadResult.public_id,
      src: uploadResult.secure_url,
      alt: fileName || 'Uploaded photo',
      title: fileName || 'Uploaded photo',
      description: `Uploaded on ${new Date().toLocaleDateString()}`,
      width: uploadResult.width,
      height: uploadResult.height,
    }

    photos.unshift(newPhoto)

    // Update the event document
    await eventRef.update({photos})

    return {
      success: true,
      photoUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {success: false, error: 'Upload failed'}
  }
}
