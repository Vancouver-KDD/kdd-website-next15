import {auth, googleProvider} from '@/firebase/client'
import {signInWithPopup, signOut, User} from 'firebase/auth'
import {create} from 'zustand'

export const useSelectedEventStore = create<{
  selectedEventId: string | null
  setSelectedEventId: (eventId: string | null) => void
}>((set) => ({
  selectedEventId: null,
  setSelectedEventId: (eventId) => set({selectedEventId: eventId}),
}))
