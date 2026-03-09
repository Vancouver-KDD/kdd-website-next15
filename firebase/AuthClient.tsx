'use client'
import {captureUserSignIn, identifyUser, resetUser} from '@/lib/posthog'
import {signInWithPopup, signOut, User} from 'firebase/auth'
import {useEffect} from 'react'
import {create} from 'zustand'
import {auth, googleProvider} from './client'

export default function AuthClient() {
  const {setLoading, setUser, setAdmin, setSuperAdmin} = useAuthStore()

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      setUser(user)
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult()
          const isAdmin = idTokenResult.claims.admin === true
          setAdmin(isAdmin)

          const isSuper = user.email === 'vancouverkdd@gmail.com'
          setSuperAdmin(isSuper)

          // Identify user in PostHog
          identifyUser(user, isAdmin)
        } catch (error) {
          console.error('Failed to get token result on auth state change:', error)
          setAdmin(false)
          setSuperAdmin(false)
        }
      } else {
        setAdmin(false)
        setSuperAdmin(false)
        // Reset PostHog user identification on logout
        resetUser()
      }
      setLoading(false)
    })
    const unsubscribeToken = auth.onIdTokenChanged(async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult()
          const isAdmin = idTokenResult.claims.admin === true
          setAdmin(isAdmin)

          const isSuper = user.email === 'vancouverkdd@gmail.com'
          setSuperAdmin(isSuper)

          // Update PostHog user identification if admin status changes
          identifyUser(user, isAdmin)
        } catch (error) {
          console.error('Failed to get token result on token change:', error)
          setAdmin(false)
          setSuperAdmin(false)
        }
      } else {
        setAdmin(false)
        setSuperAdmin(false)
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
  superadmin: boolean
  loading: boolean
  user: User | null
  logout: () => Promise<void>
  setAdmin: (admin: boolean) => void
  setSuperAdmin: (superadmin: boolean) => void
  setLoading: (loading: boolean) => void
  setUser: (user: User | null) => void
  signInWithGoogle: () => Promise<void>
}>((set) => ({
  admin: false,
  superadmin: false,
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
  setSuperAdmin: (superadmin) => set({superadmin}),
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
