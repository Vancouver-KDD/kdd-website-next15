'use client'
import type {Event} from '@/firebase/types'
import {formatISODate} from '@/lib/utils'
import {Image} from '@heroui/image'
import {Link} from '@heroui/link'
import {Spacer} from '@heroui/spacer'
import {button as buttonStyles} from '@heroui/theme'

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
              스터디 자세히 보기
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
    </div>
  )
}
