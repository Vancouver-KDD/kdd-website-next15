'use client'

import {scrapeLumaEvent} from '@/app/actions/scrape-luma'
import {updateEventParticipantCount} from '@/app/actions/update-event'
import {Event} from '@/firebase/types'
import {Button} from '@heroui/button'
import {addToast} from '@heroui/toast'
import {RefreshCw} from 'lucide-react'
import {useState} from 'react'

export default function LumaSyncButton({events}: {events: Event[]}) {
  const [loading, setLoading] = useState(false)

  const handleSync = async () => {
    setLoading(true)
    let updatedCount = 0
    let errors = 0

    try {
      const promises = events.map(async (event) => {
        // Check if joinLink is a Luma URL
        if (event.joinLink && event.joinLink.includes('lu.ma')) {
          const count = await scrapeLumaEvent(event.joinLink)
          if (count !== null) {
            const result = await updateEventParticipantCount(event.id, count)
            if (result.success) {
              updatedCount++
            } else {
              errors++
            }
          }
        }
      })

      await Promise.all(promises)

      addToast({
        title: 'Sync Complete',
        description: `Updated ${updatedCount} events from Luma.`,
        color: 'success',
      })

      if (updatedCount > 0) {
        // Hard reload to refresh server components
        window.location.reload()
      }
    } catch (error) {
      console.error('Sync error:', error)
      addToast({
        title: 'Sync Failed',
        description: 'Something went wrong while syncing.',
        color: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      color="primary"
      variant="flat"
      isLoading={loading}
      onPress={handleSync}
      className="min-w-10 px-2 sm:px-4">
      <RefreshCw size={18} />
      <span className="hidden sm:inline">Sync Luma Data</span>
    </Button>
  )
}
