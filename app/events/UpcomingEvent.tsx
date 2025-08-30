import {Spacer} from '@heroui/spacer'
import {Link} from '@heroui/link'
import {button as buttonStyles} from '@heroui/theme'
import NextImage from 'next/image'
import type {Event} from '@/firebase/types'

export default function UpcomingEvent({
  title,
  location,
  description,
  image,
  joinLink,
  date,
  id,
}: Omit<Event, 'date'> & {date: string; id: string}) {
  return (
    <div className="flex h-[433px] items-center justify-center gap-6 px-4 md:gap-10 md:px-6">
      <div className="relative h-[176px] w-[124px] rounded-lg shadow-2xl md:h-[353px] md:w-[249px]">
        <NextImage
          src={image ?? 'https://placehold.co/249x353'}
          alt="upcoming event poster"
          fill
          sizes="(min-width: 768px) 249px, 124px"
          className="rounded-lg object-contain"
          quality={100}
        />
      </div>
      <div className="flex h-full max-w-[445px] flex-col justify-center py-3 text-start">
        <div className="text-content1-foreground text-xs font-bold opacity-60">
          ANNUAL CONFERENCE
        </div>
        <Spacer y={0.5} />
        <div className="text-content1-foreground text-xs font-medium opacity-50">
          {date} | {location}
        </div>
        <Spacer y={1} />
        <div className="text-content1-foreground text-2xl font-medium md:text-3xl">{title}</div>
        <Spacer y={6} />
        <div className="line-clamp-6">{description}</div>
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
            href={'/events'}>
            전체 이벤트 보기
          </Link>
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
        </div>
        <div className="h-1/12" />
      </div>
    </div>
  )
}
