'use client'
import {Spacer} from '@heroui/spacer'
import {Link} from '@heroui/link'
import {button as buttonStyles} from '@heroui/theme'
import type {Event} from '@/firebase/types'
import {Image} from '@heroui/image'
import NextImage from 'next/image'
import eventPosterLoading from './event-poster-loading.png'
import {Button} from '@heroui/button'
import {Edit, Trash2} from 'lucide-react'
import {useAuthStore} from '@/firebase/AuthClient'
import {formatISODate} from '@/lib/utils'
import {useDeleteEvent} from '@/hooks/useDeleteEvent'

export default function UpcomingEvent({
  type,
  title,
  location,
  description,
  image,
  joinLink,
  date,
  id,
}: Omit<Event, 'date'> & {date: string; id: string}) {
  const {admin} = useAuthStore()
  const {handleDelete, deletingEventId} = useDeleteEvent({
    onSuccess: () => {
      // Reload the page to reflect changes
      window.location.reload()
    },
  })

  return (
    <div className="group relative">
      <div className="flex h-[433px] flex-col items-center justify-center gap-6 px-4 md:flex-row md:gap-10 md:px-6">
        {image ? (
          <Image
            src={image}
            alt="upcoming event poster"
            shadow="lg"
            className="w-[124px] object-contain md:w-[249px]"
          />
        ) : (
          !joinLink && (
            <NextImage
              src={eventPosterLoading}
              alt="upcoming event poster"
              className="w-[124px] object-contain md:w-[249px]"
            />
          )
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
              href={`/events/${id}`}>
              이벤트 자세히 보기
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
                참여하기
              </Link>
            )}
          </div>
          <div className="h-1/12" />
        </div>
      </div>

      {admin && (
        <div className="absolute top-2 right-2 z-20 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex gap-1">
            <Link href={`/admin/events/${id}/edit`}>
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
              onPress={() => handleDelete(id, title)}
              isLoading={deletingEventId === id}
              className="bg-white/80 backdrop-blur">
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
