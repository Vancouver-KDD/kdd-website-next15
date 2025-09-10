import {useState} from 'react'
import {addToast} from '@heroui/toast'
import {getErrorMessage} from '@/lib/utils'
import {deleteEvent} from '@/firebase/actions/event.admin'
import {useAuthStore} from '@/firebase/AuthClient'

interface UseDeleteEventOptions {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useDeleteEvent(options: UseDeleteEventOptions = {}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const {user} = useAuthStore()

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (!user) return

    if (
      !confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)
    ) {
      return
    }

    setIsDeleting(true)

    try {
      const idToken = await user.getIdToken()
      const result = await deleteEvent(idToken, eventId)

      if (result.success) {
        addToast({
          title: 'Success',
          description: result.message,
          color: 'success',
        })
        options.onSuccess?.()
      } else {
        addToast({
          title: 'Error',
          description: result.message,
          color: 'danger',
        })
        options.onError?.(new Error(result.message))
      }
    } catch (error) {
      addToast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to delete event'),
        color: 'danger',
      })
      options.onError?.(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    handleDelete,
    isDeleting,
  }
}
