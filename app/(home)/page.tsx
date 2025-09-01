import {Link} from '@heroui/link'
import {button as buttonStyles, cn} from '@heroui/theme'
import {subtitle, heroTitle, sectionTitle} from '@/components/primitives'
import NextImage from 'next/image'
import kddBgConference from './kdd-bg-conference.jpg'
import {Spacer} from '@heroui/spacer'
import {Divider} from '@heroui/divider'
import UpcomingEvents from '../events/UpcomingEvents'
import foodlyLogo from './assets/foodly.png'
import ubcLogo from './assets/ubc.png'
import anvelyLogo from './assets/anvely.png'
import cgrkLogo from './assets/cgrk.png'
import korderLogo from './assets/korder.png'
import marketRibbonLogo from './assets/market-ribbon.png'
import photoByMeLogo from './assets/photobyme.png'
import renuBioHealthLogo from './assets/renu-bio-health.png'
import vplLogo from './assets/vpl.png'
import {KoreanTitle, DeveloperTitle, DesignerTitle} from './HeroTitle'

export default function Home() {
  return (
    <div className="w-full">
      <section className="mx-auto flex max-w-[588px] flex-col px-6 py-8 md:py-10">
        <span className={heroTitle({className: 'flex flex-row'})}>
          <span className="font-black">K</span>
          <KoreanTitle />
        </span>
        <span className={heroTitle({className: 'flex flex-row'})}>
          <span className="font-black">D</span>
          <DeveloperTitle />
        </span>
        <span className={heroTitle({className: 'flex flex-row'})}>
          <span className="font-black">D</span>
          <DesignerTitle />
        </span>
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
              {
                name: 'foodly',
                img: foodlyLogo,
                link: 'https://foodly.ca',
                className: 'dark:brightness-125',
              },
              {
                name: 'UBC',
                img: ubcLogo,
                link: 'https://ubc.ca',
                className: 'dark:invert-50',
              },
              {
                name: 'Anvely',
                img: anvelyLogo,
                link: 'https://anvelyonline.com/',
                className: 'dark:invert',
              },

              {
                name: 'Consulate General of the Republic of Korea in Vancouver',
                img: cgrkLogo,
                link: 'https://overseas.mofa.go.kr/ca-vancouver-en/index.do',
              },
              {
                name: 'KOrder',
                img: korderLogo,
                link: 'https://korder.app',
                className: 'dark:brightness-125',
              },

              {
                name: 'Market Ribbon',
                img: marketRibbonLogo,
                link: 'https://marketribbon.ca',
                className: 'dark:invert-75',
              },
              {
                name: 'Photo by Me',
                img: photoByMeLogo,
                link: 'https://photobyme.ca/',
                className: 'dark:invert',
              },
              {
                name: 'Renu Bio Health',
                img: renuBioHealthLogo,
                link: 'https://renubiohealth.com',
                className: 'dark:invert-50',
              },
              {
                name: 'VPL',
                img: vplLogo,
                link: 'https://vpl.ca',
              },
            ].map((item, index) => (
              <Link key={index} href={item.link} isExternal>
                <div className="relative h-[73px] w-[153px]">
                  <NextImage
                    src={item.img}
                    alt={item.name}
                    fill
                    sizes="153px"
                    className={cn('object-contain', item.className)}
                    quality={100}
                  />
                </div>
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
            href={'/contact'}>
            스폰서십 문의하기
          </Link>
          <Spacer y={40} />
        </div>
      </section>
    </div>
  )
}
