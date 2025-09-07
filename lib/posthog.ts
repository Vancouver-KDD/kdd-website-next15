import posthog from 'posthog-js'
import {User} from 'firebase/auth'

/**
 * PostHog utility functions for user identification and event tracking
 */

export const POSTHOG_EVENTS = {
  USER_SIGNED_IN: 'user_signed_in',
  USER_SIGNED_OUT: 'user_signed_out',
  USER_IDENTIFIED: 'user_identified',
} as const

export const POSTHOG_PROPERTIES = {
  FIREBASE_USER_ID: 'firebase_user_id',
  USER_EMAIL: 'user_email',
  USER_DISPLAY_NAME: 'user_display_name',
  USER_PHOTO_URL: 'user_photo_url',
  IS_ADMIN: 'is_admin',
} as const

/**
 * Identify a user in PostHog with Firebase Auth user data
 */
export function identifyUser(user: User, isAdmin: boolean = false) {
  if (!posthog.__loaded) {
    return
  }

  posthog.identify(user.uid, {
    [POSTHOG_PROPERTIES.USER_EMAIL]: user.email,
    [POSTHOG_PROPERTIES.USER_DISPLAY_NAME]: user.displayName,
    [POSTHOG_PROPERTIES.USER_PHOTO_URL]: user.photoURL,
    [POSTHOG_PROPERTIES.IS_ADMIN]: isAdmin,
  })
}

/**
 * Reset PostHog user identification (call on logout)
 */
export function resetUser() {
  if (!posthog.__loaded) {
    console.warn('PostHog not loaded yet, skipping user reset')
    return
  }

  posthog.reset()
  posthog.capture(POSTHOG_EVENTS.USER_SIGNED_OUT)
}

/**
 * Capture user sign-in event
 */
export function captureUserSignIn(user: User, isAdmin: boolean = false) {
  if (!posthog.__loaded) {
    console.warn('PostHog not loaded yet, skipping sign-in event')
    return
  }

  posthog.capture(POSTHOG_EVENTS.USER_SIGNED_IN, {
    [POSTHOG_PROPERTIES.FIREBASE_USER_ID]: user.uid,
    [POSTHOG_PROPERTIES.USER_EMAIL]: user.email,
    [POSTHOG_PROPERTIES.IS_ADMIN]: isAdmin,
  })
}

/**
 * Check if PostHog is loaded and ready
 */
export function isPostHogLoaded(): boolean {
  return posthog.__loaded === true
}
