'use client'
import {Event} from '@/firebase/types'
import {Image} from '@heroui/image'
import {Link} from '@heroui/link'
import {Tabs as HerouiTabs, Tab} from '@heroui/tabs'
import {button as buttonStyles} from '@heroui/theme'
import {useEffect, useState} from 'react'
import Photos from './(photos)/Photos'
import {useTranslation} from '@/lib/i18n'
import en from '@/dictionaries/en.json'
import ko from '@/dictionaries/ko.json'

const TABS = [
  {
    key: 'details',
    title: '스터디 정보',
  },
  {
    key: 'reviews',
    title: '스터디 후기',
  },
  {
    key: 'photos',
    title: '스터디 사진',
  },
]
const DISABLED_KEYS = [TABS[1].key]

export default function Tabs({event}: {event: Event}) {
  const {t} = useTranslation({...en, ...ko})
  
  // Get key after # for example http://localhost:3000/events/rtvOYkyRMKK4F6fDEsNn#details
  const [selected, setSelected] = useState(TABS[0].key)

  // Initialize from hash and listen for hash changes
  useEffect(() => {
    const applyFromHash = () => {
      const key = window.location.hash.split('#')[1]
      const keyIsValid = TABS.some((tab) => tab.key === key)
      const keyIsDisabled = DISABLED_KEYS.includes(key)
      const shouldForceDetails = key !== 'photos' && (keyIsDisabled || !keyIsValid)
      setSelected(shouldForceDetails ? TABS[0].key : key)
    }

    if (typeof window !== 'undefined') {
      applyFromHash()
      window.addEventListener('hashchange', applyFromHash)
      return () => window.removeEventListener('hashchange', applyFromHash)
    }
  }, [DISABLED_KEYS])

  return (
    <HerouiTabs
      disabledKeys={DISABLED_KEYS}
      selectedKey={selected}
      onSelectionChange={(key) => {
        window.location.hash = (key as string) || TABS[0].key
      }}>
      <Tab key={TABS[0].key} title={t(`study.tabs.${TABS[0].key}`)} className="text-medium">
        <div className="grid grid-cols-1 gap-10 py-8 md:grid-cols-2">
          <div className="space-y-4">
            {!!event.image && (
              <Image
                src={event.image ?? ''}
                alt={'poster'}
                shadow="lg"
                removeWrapper
                className="h-auto rounded-lg object-contain"
              />
            )}
            {!!event.joinLink && (
              <Link
                className={buttonStyles({
                  variant: 'shadow',
                  radius: 'sm',
                  size: 'md',
                  color: 'primary',
                  className: 'font-light',
                })}
                isExternal={!!event.joinLink}
                href={event.joinLink}>
                {t('study.buttons.join')}
              </Link>
            )}
          </div>
          <div className="text-start font-normal whitespace-pre-line">{event.description}</div>
        </div>
      </Tab>
      <Tab key={TABS[1].key} title={t(`study.tabs.${TABS[1].key}`)} className="text-medium">
        <div></div>
      </Tab>
      <Tab key={TABS[2].key} title={t(`study.tabs.${TABS[2].key}`)} className="text-medium">
        <div className="py-8">
          <Photos photos={event.photos ?? []} studyId={event.id} />
        </div>
      </Tab>
    </HerouiTabs>
  )
}
