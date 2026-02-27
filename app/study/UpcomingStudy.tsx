'use client'
import {useAuthStore} from '@/firebase/AuthClient'
import type {Event} from '@/firebase/types'
import {deleteStudy} from '@/firebase/actions/study.admin'
import {formatISODate} from '@/lib/utils'
import {Button} from '@heroui/button'
import {Image} from '@heroui/image'
import {Link} from '@heroui/link'
import {Spacer} from '@heroui/spacer'
import {useTranslation} from '@/lib/i18n'
import en from '@/dictionaries/en.json'
import ko from '@/dictionaries/ko.json'
import {button as buttonStyles} from '@heroui/theme'
import {addToast} from '@heroui/toast'
import {Edit, Trash2} from 'lucide-react'
import {useState} from 'react'

export default function UpcomingStudy({
  type,
  title,
  location,
  description,
  image,
  joinLink,
  date,
  id,
}: Omit<Event, 'date'> & {date: string; id: string}) {
  const {t} = useTranslation({...en, ...ko})
  const {user, admin} = useAuthStore()
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleDelete = async () => {
    if (!user) return

    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      const idToken = await user.getIdToken()
      const result = await deleteStudy(idToken, id)

      if (result.success) {
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
        description: 'Failed to delete study',
        color: 'danger',
      })
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <div className="group relative">
      <div className="flex flex-col items-center justify-center gap-14 px-4 md:flex-row md:gap-10 md:px-6">
        {image && (
          <Image
            src={image}
            alt="upcoming study poster"
            shadow="lg"
            className="w-[249px] object-contain"
          />
        )}
        <div className="flex h-full max-w-[445px] flex-col justify-center py-3 text-start">
          {!!type && (
            <div className="text-content1-foreground text-xs font-bold opacity-60">{type}</div>
          )}
          <Spacer y={0.5} />
          <div className="text-content1-foreground text-xs font-medium opacity-50">
            {formatISODate(date)} | {location}
          </div>
          <Spacer y={1} />
          <div className="text-content1-foreground text-2xl font-medium md:text-3xl">{title}</div>
          <Spacer y={6} />

          <div className="line-clamp-8 whitespace-pre-line">{description}</div>
          <Spacer y={6} />
          <div className="flex flex-wrap gap-4">
            <Link
              className={buttonStyles({
                variant: 'shadow',
                radius: 'sm',
                size: 'md',
                color: 'default',
                className: 'bg-default-100 font-light drop-shadow-lg',
              })}
              href={`/study/${id}`}>
              {t('study.buttons.details')}
            </Link>
            {!!joinLink && (
              <Link
                className={buttonStyles({
                  variant: 'shadow',
                  radius: 'sm',
                  size: 'md',
                  color: 'primary',
                  className: 'font-light',
                })}
                isExternal={!!joinLink}
                href={joinLink}>
                {t('study.buttons.join')}
              </Link>
            )}
          </div>
          <div className="h-1/12" />
        </div>
      </div>

      {admin && (
        <div className="absolute top-2 right-2 z-20 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex gap-1">
            <Link href={`/admin/studies/${id}/edit`}>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                startContent={<Edit className="h-3 w-3" />}
                className="bg-white/80 backdrop-blur">
                Edit
              </Button>
            </Link>
            <Button
              size="sm"
              variant="flat"
              color="danger"
              startContent={<Trash2 className="h-3 w-3" />}
              onPress={handleDelete}
              isLoading={isDeleting}
              className="bg-white/80 backdrop-blur">
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
