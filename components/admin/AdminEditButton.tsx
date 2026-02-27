'use client'

import {useAuthStore} from '@/firebase/AuthClient'
import {Button} from '@heroui/button'
import {Link} from '@heroui/link'
import {Edit} from 'lucide-react'

export default function AdminEditButton({editUrl}: {editUrl: string}) {
  const {admin} = useAuthStore()

  if (!admin) {
    return null
  }

  return (
    <div className="absolute top-4 right-4 z-50 md:top-8 md:right-8">
      <Link href={editUrl}>
        <Button
          size="sm"
          color="primary"
          variant="shadow"
          startContent={<Edit className="h-4 w-4" />}
          className="bg-primary shadow-lg"
        >
          Edit Page (Admin)
        </Button>
      </Link>
    </div>
  )
}
