import {create} from 'zustand'

export const useSelectedEventStore = create<{
  selectedEventId: string | null
  setSelectedEventId: (eventId: string | null) => void
}>((set) => ({
  selectedEventId: null,
  setSelectedEventId: (eventId) => set({selectedEventId: eventId}),
}))
