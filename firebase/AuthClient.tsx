'use client'
import {captureUserSignIn, identifyUser, resetUser} from '@/lib/posthog'
import {signInWithPopup, signOut, User} from 'firebase/auth'
import {useEffect} from 'react'
import {create} from 'zustand'
import {auth, googleProvider} from './client'

export default function AuthClient() {
  const {setLoading, setUser, setAdmin} = useAuthStore()

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      setUser(user)
      if (user) {
        const idTokenResult = await user.getIdTokenResult()
        const isAdmin = idTokenResult.claims.admin === true
        setAdmin(isAdmin)

        // Identify user in PostHog
        identifyUser(user, isAdmin)
      } else {
        setAdmin(false)
        // Reset PostHog user identification on logout
        resetUser()
      }
      setLoading(false)
    })
    const unsubscribeToken = auth.onIdTokenChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult()
        const isAdmin = idTokenResult.claims.admin === true
        setAdmin(isAdmin)

        // Update PostHog user identification if admin status changes
        identifyUser(user, isAdmin)
      } else {
        setAdmin(false)
      }
    })
    return () => {
      unsubscribeAuth()
      unsubscribeToken()
    }
  }, [])
  return null
}

export const useAuthStore = create<{
  admin: boolean
  loading: boolean
  user: User | null
  logout: () => Promise<void>
  setAdmin: (admin: boolean) => void
  setLoading: (loading: boolean) => void
  setUser: (user: User | null) => void
  signInWithGoogle: () => Promise<void>
}>((set) => ({
  admin: false,
  loading: true,
  user: null,
  logout: async () => {
    set({loading: true})
    await signOut(auth)
    set({user: null, loading: false})

    // Reset PostHog user identification on logout
    resetUser()
  },
  setAdmin: (admin) => set({admin}),
  setLoading: (loading) => set({loading}),
  setUser: (user) => set({user}),
  signInWithGoogle: async () => {
    set({loading: true})
    const user = await signInWithPopup(auth, googleProvider)
    set({user: user.user, loading: false})

    // Capture sign-in event in PostHog
    const idTokenResult = await user.user.getIdTokenResult()
    const isAdmin = idTokenResult.claims.admin === true
    captureUserSignIn(user.user, isAdmin)
  },
}))
