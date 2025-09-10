import 'server-only'

import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function deletePhoto(publicId: string) {
  return await cloudinary.uploader.destroy(publicId)
}

export async function deleteEventPhotos(eventId: string) {
  return await cloudinary.uploader.destroy(`events/${eventId}`)
}
