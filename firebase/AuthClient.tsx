'use client'
import {useEffect} from 'react'
import {auth, googleProvider} from './client'
import {create} from 'zustand'
import {signInWithPopup, signOut} from 'firebase/auth'
import {User} from 'firebase/auth'

export default function AuthClient() {
  const {setLoading, setUser, setAdmin} = useAuthStore()

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      setUser(user)
      if (user) {
        const idTokenResult = await user.getIdTokenResult()
        setAdmin(idTokenResult.claims.admin === true)
      } else {
        setAdmin(false)
      }
      setLoading(false)
    })
    const unsubscribeToken = auth.onIdTokenChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult()
        setAdmin(idTokenResult.claims.admin === true)
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
  },
  setAdmin: (admin) => set({admin}),
  setLoading: (loading) => set({loading}),
  setUser: (user) => set({user}),
  signInWithGoogle: async () => {
    set({loading: true})
    const user = await signInWithPopup(auth, googleProvider)
    set({user: user.user, loading: false})
  },
}))
