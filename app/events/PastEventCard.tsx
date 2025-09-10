'use client'
import {CardFooter} from '@heroui/card'
import {Image} from '@heroui/image'
import {Card} from '@heroui/card'
import {Link} from '@heroui/link'
import {Button} from '@heroui/button'
import {Edit, Trash2} from 'lucide-react'
import {useAuthStore} from '@/firebase/AuthClient'
import {useRouter} from 'next/navigation'
import {addToast} from '@heroui/toast'
import {deleteEvent} from '@/firebase/actions/event.admin'
import {formatISODate, generateGradientSVG} from '@/lib/utils'

export default function PastEventCard({
  id,
  title,
  image,
  date,
}: {
  id: string
  title: string
  image?: string
  date: string
}) {
  const {user, admin} = useAuthStore()
  const router = useRouter()

  const handleDelete = async () => {
    if (!user) return

    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    try {
      const idToken = await user.getIdToken()
      const result = await deleteEvent(idToken, id)

      if (result.success) {
        addToast({
          title: 'Success',
          description: result.message,
          color: 'success',
        })
        // Reload the page to reflect changes
        window.location.reload()
      } else {
        addToast({
          title: 'Error',
          description: result.message,
          color: 'danger',
        })
      }
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to delete event',
        color: 'danger',
      })
    }
  }

  const handleEdit = () => {
    router.push(`/admin/events/${id}/edit`)
  }

  return (
    <div className="group relative">
      <Link href={`/events/${id}`}>
        <Card isHoverable shadow="lg" className="max-h-[313px] justify-center">
          <Image
            draggable={false}
            src={image || generateGradientSVG(title)}
            width={'100%'}
            className="min-h-56"
            isZoomed
          />

          <CardFooter className="absolute bottom-0 z-10 flex flex-col items-start bg-white/30 text-start backdrop-blur">
            <div className="text-sm text-black">{formatISODate(date)}</div>
            <div className="text-sm text-black">{title}</div>
          </CardFooter>
        </Card>
      </Link>

      {admin && (
        <div className="absolute top-2 right-2 z-20 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="flat"
              color="primary"
              startContent={<Edit className="h-3 w-3" />}
              onPress={handleEdit}
              className="bg-white/80 backdrop-blur">
              Edit
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="danger"
              startContent={<Trash2 className="h-3 w-3" />}
              onPress={handleDelete}
              className="bg-white/80 backdrop-blur">
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
