'use client'

import {Spacer} from '@heroui/spacer'
import {Link} from '@heroui/link'
import {button as buttonStyles} from '@heroui/theme'
import NextImage from 'next/image'

export default function UpcomingEvents() {
  return (
    <div className="flex h-[433px] items-center justify-center gap-10">
      <NextImage
        src={'https://placehold.co/249x353/png?font=noto%20sans'}
        alt="upcoming event poster"
        width={249}
        height={353}
        className="max-h-[353px] max-w-[400px] rounded-lg shadow-2xl"
      />
      <div className="flex h-full w-[445px] flex-col justify-center p-3 text-start">
        <div className="text-content1-foreground text-xs font-bold opacity-60">
          ANNUAL CONFERENCE
        </div>
        <Spacer y={0.5} />
        <div className="text-content1-foreground text-xs font-medium opacity-50">
          2025.08.30 | UBC Robson Square
        </div>
        <Spacer y={1} />
        <div className="text-content1-foreground text-2xl font-medium md:text-3xl">
          Technology in Uncertainty
        </div>
        <Spacer y={6} />
        <div className="line-clamp-6">
          불확실한 시대, 기술은 때로 도전이자 기회로 다가옵니다. 이번 세션에서는 변화 속에서 혁신이
          어떻게 우리를 앞으로 이끌고, 함께 성장과 새로운 가능성을 열어가는지를 이야기합니다. Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Similique, a reiciendis. Rem incidunt
          dignissimos quos esse, obcaecati delectus deserunt ipsa nostrum perferendis. Doloremque
          nisi dolores tempore et quos in iusto. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Similique, a reiciendis. Rem incidunt dignissimos quos esse, obcaecati delectus
          deserunt ipsa nostrum perferendis. Doloremque nisi dolores tempore et quos in iusto. Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Similique, a reiciendis. Rem incidunt
          dignissimos quos esse, obcaecati delectus deserunt ipsa nostrum perferendis. Doloremque
          nisi dolores tempore et quos in iusto. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Similique, a reiciendis. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Similique, a reiciendis.
        </div>
        <Spacer y={6} />
        <div className="flex gap-4">
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
            href={'/events'}>
            참여하기
          </Link>
        </div>
        <div className="h-1/12" />
      </div>
    </div>
  )
}
