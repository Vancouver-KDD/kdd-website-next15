import {Link} from '@heroui/link'
import {button as buttonStyles} from '@heroui/theme'
import {subtitle, heroTitle, sectionTitle, sectionSubtitle} from '@/components/primitives'
import NextImage from 'next/image'
import kddBgConference from './kdd-bg-conference.jpg'
import {Spacer} from '@heroui/spacer'
import {Divider} from '@heroui/divider'
import UpcomingEvents from './UpcomingEvents'

export default function Home() {
  return (
    <div className="mt-30 w-full">
      <section className="mx-auto flex max-w-[588px] flex-col px-6 py-8 md:py-10">
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
            다음 이벤트 보기
          </Link>
        </div>
      </section>
      <Spacer y={40} />
      <section className="h-[507px]">
        <NextImage
          src={kddBgConference}
          alt="KDD Conference"
          className="absolute right-0 left-0 h-[507px] object-cover"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute right-0 left-0 h-[507px] bg-black/60">
          <div className="flex h-full items-center justify-center">
            <div className="max-w-[926px] border-y-1 border-solid border-white px-16 py-8 text-white md:px-24 md:py-12">
              <span className={sectionTitle()}>KDD at a Glance</span>
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
      <Spacer y={52} />

      <section className="mx-auto max-w-screen-lg text-center">
        <div className={sectionTitle()}>Upcoming Events</div>
        <span className={sectionSubtitle()}>다가오는 KDD 행사를 만나보세요</span>
        <Spacer y={10} />
        <Divider orientation="horizontal" className="bg-foreground-400 w-full" />
        <Spacer y={16} />
        <UpcomingEvents />
        <Spacer y={16} />
        <Divider orientation="horizontal" className="bg-foreground-400 w-full" />
        <Spacer y={20} />
      </section>

      {/* <WhatWeOfferSection /> */}

      <section className="bg-background0 flex flex-col items-center px-6">
        <Spacer y={40} />
        <div className="max-w-screen-lg text-center">
          <div className={sectionTitle()}>Sponsors & Partners</div>
          <Spacer y={16} />
          <div className="flex flex-wrap justify-center gap-10">
            {[
              ...Array.from({length: 9}, () => ({
                name: 'UBC',
                img: `https://placehold.co/${Math.floor(Math.random() * 153) + 1}x${Math.floor(Math.random() * 73) + 1}@3x.png?font=noto%20sans`,
                link: 'https://www.ubc.ca',
              })),
            ].map((item, index) => (
              <Link key={index} href={item.link}>
                <NextImage
                  src={item.img}
                  alt={item.name}
                  width={153}
                  height={73}
                  className="max-h-[73px] max-w-[153px] object-contain"
                />
              </Link>
            ))}
          </div>
          <Spacer y={16} />
          <Link
            className={buttonStyles({
              variant: 'shadow',
              radius: 'sm',
              size: 'md',
              color: 'primary',
              className: 'font-light',
            })}
            href={'/events'}>
            스폰서십 문의하기
          </Link>
          <Spacer y={40} />
        </div>
      </section>
    </div>
  )
}
