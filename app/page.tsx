import {Link} from '@heroui/link'
import {button as buttonStyles} from '@heroui/theme'
import {subtitle, heroTitle} from '@/components/primitives'
import Image from 'next/image'
import kddBgConference from './kdd-bg-conference.jpg'
import {Spacer} from '@heroui/spacer'

export default function Home() {
  return (
    <div>
      <section className="mx-auto flex max-w-lg flex-col py-8 md:py-10">
        <span className={heroTitle()}>Knowledge.</span>
        <span className={heroTitle()}>Diversity.</span>
        <span className={heroTitle()}>Drive.</span>
        <div className={subtitle({className: 'mt-4 mb-6'})}>
          KDD는 지식을 나누고, 새로운 가능성을 발견하며, 함께 성장하는 한인 IT 커뮤니티입니다.
        </div>

        <div className="flex gap-6">
          <Link
            className={buttonStyles({
              variant: 'shadow',
              radius: 'sm',
              size: 'md',
              color: 'default',
              className: 'bg-default-100 font-light drop-shadow-lg',
            })}
            href={'/about'}>
            KDD 소개
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
            다음 이벤트
          </Link>
        </div>
      </section>
      <section className="h-[507px]">
        <Image
          src={kddBgConference}
          alt="KDD Conference"
          className="absolute right-0 left-0 h-[507px] object-cover"
          objectFit="cover"
        />
        <div className="absolute right-0 left-0 h-[507px] bg-black/60">
          <div className="flex h-full items-center justify-center">
            <div className="max-w-[926px] border-y-1 border-solid border-white px-16 py-8 text-white md:px-24 md:py-12">
              <span className="text-2xl font-semibold md:text-3xl">KDD at a Glance</span>
              <Spacer y={6} />
              <span className="text-md md:text-lg">
                KDD (Korean Developers & Designers)는 2017년 설립된 캐나다 서부 최대 한인 IT
                커뮤니티입니다. 개발자, 디자이너, 기획자, 학생 등 다양한 IT 인재들이 모여 지식과
                경험을 나누고, 협력하며 함께 성장하는 플랫폼으로 발전하고 있습니다.
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
