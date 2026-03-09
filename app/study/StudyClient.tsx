'use client'
import {
  label as labelStyles,
  sectionSubtitle,
  sectionTitle,
  subtitle,
  title,
} from '@/components/primitives'
import en from '@/dictionaries/en.json'
import ko from '@/dictionaries/ko.json'
import {useTranslation} from '@/lib/i18n'
import {Divider} from '@heroui/divider'
import {Link} from '@heroui/link'
import {Spacer} from '@heroui/spacer'
import {button as buttonStyles} from '@heroui/theme'
import NextImage from 'next/image'
import PastStudyCard from './PastStudyCard'
import StudyGroupImg from './study-group.png'
import UpcomingStudies from './UpcomingStudies'

import {Event} from '@/firebase/types'

export default function StudyClient({
  futureStudies,
  ongoingStudies,
  pastStudies,
}: {
  futureStudies: (Event & {id: string})[]
  ongoingStudies: (Event & {id: string})[]
  pastStudies: (Event & {id: string})[]
}) {
  const {t} = useTranslation({...en, ...ko})

  return (
    <div className="flex flex-col items-center">
      <section className="mx-auto w-full max-w-5xl self-start px-6">
        <h1 className={title()}>{t('nav.study')}</h1>
        <Spacer y={4} />
        <h3 className={subtitle({className: 'max-w-[640px] whitespace-pre-line'})}>
          {t('study.hero.subtitle')}
        </h3>
        <Spacer y={8} />
        <Link
          href="/about"
          className={buttonStyles({
            variant: 'shadow',
            radius: 'sm',
            size: 'md',
            color: undefined,
            className: 'bg-default-100 text-default-900',
          })}>
          About Us
        </Link>
      </section>
      <Spacer y={40} />
      <section className="mx-4 flex justify-center">
        <NextImage
          src={StudyGroupImg}
          width={460}
          height={460}
          className="w-[460px] rounded-2xl shadow-xl"
          alt="Study Group Illustration"
        />
      </section>
      <Spacer y={6} />
      <section id="upcoming-studies" className="w-full">
        <UpcomingStudies studies={futureStudies} />
      </section>

      {ongoingStudies.length > 0 && (
        <>
          <Spacer className="h-20 md:h-40" />
          <section id="ongoing-studies" className="mx-auto w-full max-w-5xl self-start px-6">
            <div className="text-center">
              <h1 className={sectionTitle({className: 'text-center'})}>
                {t('study.sections.ongoing')}
              </h1>
              <h3 className={sectionSubtitle({className: 'text-center'})}>
                {t('study.sections.ongoing_subtitle')}
              </h3>
            </div>
            <Spacer y={6} />
            <Divider />
            <Spacer y={16} />
            <div className="grid grid-cols-1 items-center gap-22 md:grid-cols-2 lg:grid-cols-3">
              {ongoingStudies.map((study) => (
                <PastStudyCard key={study.id} {...study} />
              ))}
            </div>
          </section>
        </>
      )}

      <Spacer className="h-20 md:h-40" />
      <section id="past-studies" className="mx-auto w-full max-w-5xl self-start px-6">
        <div className="text-center">
          <h1 className={sectionTitle({className: 'text-center'})}>{t('study.sections.past')}</h1>
          <h3 className={sectionSubtitle({className: 'text-center'})}>
            {t('study.sections.past_subtitle')}
          </h3>
        </div>
        <Spacer y={6} />
        <Divider />
        {(() => {
          const groups = pastStudies.reduce((acc, study) => {
            const year = new Date(study.date).getFullYear()
            if (!acc.has(year)) acc.set(year, [])
            acc.get(year)!.push(study)
            return acc
          }, new Map<number, typeof pastStudies>())

          return Array.from(groups.entries()).map(([year, studies]) => (
            <div key={year}>
              <Spacer y={16} />
              <h3 className={labelStyles()}>{year}</h3>
              <Spacer y={9} />
              <div className="grid grid-cols-1 items-center gap-22 md:grid-cols-2 lg:grid-cols-3">
                {studies.map((study) => (
                  <PastStudyCard key={study.id} {...study} />
                ))}
              </div>
            </div>
          ))
        })()}
      </section>
    </div>
  )
}
