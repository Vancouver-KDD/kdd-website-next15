'use client'
import {heroTitle, sectionTitle, subtitle} from '@/components/primitives'
import {useTranslation} from '@/lib/i18n'
import en from '@/dictionaries/en.json'
import ko from '@/dictionaries/ko.json'
import {Divider} from '@heroui/divider'
import {Link} from '@heroui/link'
import {Spacer} from '@heroui/spacer'
import {button as buttonStyles, cn} from '@heroui/theme'
import NextImage from 'next/image'
import UpcomingEvents from '../events/UpcomingEvents'
import anvelyLogo from './assets/anvely.png'
import cgrkLogo from './assets/cgrk.png'
import foodlyLogo from './assets/foodly.png'
import korderLogo from './assets/korder.png'
import marketRibbonLogo from './assets/market-ribbon.png'
import photoByMeLogo from './assets/photobyme.png'
import renuBioHealthLogo from './assets/renu-bio-health.png'
import ubcLogo from './assets/ubc.png'
import vplLogo from './assets/vpl.png'
import {DesignerTitle, DeveloperTitle, KoreanTitle} from './HeroTitle'
import kddBgConference from './kdd-bg-conference.avif'

import {Event} from '@/firebase/types'

export default function HomeClient({futureEvents}: {futureEvents: (Event & {id: string})[]}) {
  const {t} = useTranslation({...en, ...ko})
  return (
    <div className="w-full">
      <section className="mx-auto flex max-w-[588px] flex-col px-6 py-8 md:py-10">
        <div className={heroTitle({className: 'flex flex-row'})}>
          <span className="font-black">K</span>
          <KoreanTitle />
        </div>
        <div className={heroTitle({className: 'flex flex-row'})}>
          <span className="font-black">D</span>
          <DeveloperTitle />
        </div>
        <div className={heroTitle({className: 'flex flex-row'})}>
          <span className="font-black">D</span>
          <DesignerTitle />
        </div>
        <div className={subtitle({className: 'mt-4 mb-6'})}>
          {t('home.hero.subtitle')}
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
            {t('nav.about')}
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
            {t('home.sections.upcoming')}
          </Link>
        </div>
      </section>
      <Spacer y={40} />
      <section className="h-[507px]">
        <NextImage
          src={kddBgConference}
          alt="KDD Conference"
          className="absolute right-0 left-0 h-[507px] object-cover"
          width={3840}
          height={2560}
          quality={90}
          priority={false}
        />
        <div className="absolute right-0 left-0 h-[507px] bg-black/60">
          <div className="flex h-full items-center justify-center">
            <div className="max-w-[926px] border-y-1 border-solid border-white px-16 py-8 text-white md:px-24 md:py-12">
              <span className={sectionTitle()}>KDD at a Glance</span>
              <Spacer y={6} />
              <span className="text-md md:text-lg">
                {t('home.hero.at_a_glance_subtitle')}
              </span>
            </div>
          </div>
        </div>
      </section>
      <Spacer y={52} />

      <section className="mx-auto max-w-5xl text-center">
        <Spacer y={10} />
        <Divider orientation="horizontal" className="bg-foreground-400 w-full" />
        <Spacer y={16} />
        <UpcomingEvents events={futureEvents} />
        <Spacer y={16} />
        <Divider orientation="horizontal" className="bg-foreground-400 w-full" />
        <Spacer y={20} />
      </section>

      {/* <WhatWeOfferSection /> */}

      <section className="bg-background0 flex flex-col items-center px-6">
        <Spacer y={40} />
        <div className="max-w-5xl text-center">
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
            {t('nav.contact')}
          </Link>
          <Spacer y={40} />
        </div>
      </section>
    </div>
  )
}
