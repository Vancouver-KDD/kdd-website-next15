import 'server-only'
/**
 * Server-side Cloudinary utilities for generating srcSet
 * This file should only be used on the server side
 */

export interface CloudinarySrcSet {
  src: string
  srcSet: string
}

/**
 * Generates a Cloudinary srcSet with multiple image sizes for responsive loading
 * @param publicId - The Cloudinary public ID of the image
 * @param cloudName - The Cloudinary cloud name
 * @param originalUrl - The original Cloudinary URL to extract file extension
 * @param options - Additional transformation options
 * @returns Object containing src and srcSet strings
 */
export function generateCloudinarySrcSet(
  publicId: string,
  cloudName: string,
  originalUrl: string,
  options: {
    format?: 'auto' | 'webp' | 'jpg' | 'png'
    quality?: 'auto' | number
    crop?: 'scale' | 'fit' | 'fill' | 'crop'
    gravity?: 'auto' | 'center' | 'face' | 'faces'
  } = {}
): CloudinarySrcSet {
  const {quality = 'auto', crop = 'scale', gravity = 'auto'} = options

  // Extract file extension from original URL to determine format
  const fileExtension = originalUrl.match(/\.[^.]+$/)?.[0] || '.jpg'
  const format = fileExtension.replace('.', '') as 'jpg' | 'png' | 'webp'

  // Define the different sizes for responsive images
  const sizes = [300, 600, 900, 1200, 1600, 2000]

  // Base transformation parameters
  const baseParams = [
    `f_${format}`,
    `q_${quality}`,
    `c_${crop}`,
    gravity !== 'auto' ? `g_${gravity}` : '',
  ]
    .filter(Boolean)
    .join(',')

  // Generate the base URL
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`

  // Generate src (default size - 600px)
  const src = `${baseUrl}/${baseParams},w_600/${publicId}.${format}`

  // Generate srcSet with different sizes
  const srcSetEntries = sizes.map((size) => {
    const url = `${baseUrl}/${baseParams},w_${size}/${publicId}.${format}`
    return `${url} ${size}w`
  })

  const srcSet = srcSetEntries.join(', ')

  return {src, srcSet}
}

/**
 * Extracts public ID from a Cloudinary URL
 * @param url - The Cloudinary URL
 * @returns The public ID or null if not a valid Cloudinary URL
 */
export function extractPublicIdFromUrl(url: string): string | null {
  // Check if it's a Cloudinary URL
  if (!url.includes('res.cloudinary.com')) {
    return null
  }

  // Extract the public ID by finding the version part (starts with 'v' followed by digits)
  const urlParts = url.split('/')
  const uploadIndex = urlParts.findIndex((part) => part === 'upload')

  if (uploadIndex === -1) {
    return null
  }

  // Find the version part (starts with 'v' followed by digits)
  let versionIndex = -1
  for (let i = uploadIndex + 1; i < urlParts.length; i++) {
    if (/^v\d+$/.test(urlParts[i])) {
      versionIndex = i
      break
    }
  }

  if (versionIndex === -1) {
    return null
  }

  // Extract the public ID (everything from version index onwards)
  const publicIdParts = urlParts.slice(versionIndex)
  if (publicIdParts.length === 0) {
    return null
  }

  // Join the parts and remove file extension
  const publicId = publicIdParts.join('/').replace(/\.[^.]+$/, '')

  return publicId || null
}

/**
 * Generates srcSet for a photo
 * @param photo - The photo object
 * @param cloudName - The Cloudinary cloud name
 * @returns The photo with srcSet added, or original photo if not a Cloudinary URL
 */
export function addSrcSetToPhoto(
  photo: {src: string; width: number; height: number; [key: string]: any},
  cloudName: string
) {
  const publicId = extractPublicIdFromUrl(photo.src)
  if (!publicId) {
    return photo
  }

  const {srcSet} = generateCloudinarySrcSet(publicId, cloudName, photo.src)

  return {
    ...photo,
    srcSet: srcSet.split(', ').map((srcSetEntry) => {
      const [url, widthStr] = srcSetEntry.trim().split(' ')
      const width = parseInt(widthStr.replace('w', ''))
      // Calculate height maintaining aspect ratio
      const aspectRatio = photo.height / photo.width
      const height = Math.round(width * aspectRatio)

      return {
        src: url,
        width,
        height,
      }
    }),
  }
}
