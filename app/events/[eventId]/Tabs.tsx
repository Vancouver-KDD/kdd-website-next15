'use client'
import {useEffect, useState} from 'react'
import {Tab, Tabs as HerouiTabs} from '@heroui/tabs'
import {Event} from '@/firebase/types'
import {Image} from '@heroui/image'
import Photos from './(photos)/Photos'
import {Link} from '@heroui/link'
import {button as buttonStyles} from '@heroui/theme'

const TABS = [
  {
    key: 'details',
    title: '행사 정보',
  },
  {
    key: 'reviews',
    title: '행사 후기',
  },
  {
    key: 'photos',
    title: '행사 사진',
  },
]
const DISABLED_KEYS = [TABS[1].key]

export default function Tabs({event}: {event: Event}) {
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
      <Tab key={TABS[0].key} title={TABS[0].title} className="text-medium">
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
                참여하기
              </Link>
            )}
          </div>
          <div className="text-start font-normal whitespace-pre-line">{event.description}</div>
        </div>
      </Tab>
      <Tab key={TABS[1].key} title={TABS[1].title} className="text-medium">
        <div></div>
      </Tab>
      <Tab key={TABS[2].key} title={TABS[2].title} className="text-medium">
        <div className="py-8">
          <Photos photos={event.photos ?? []} eventId={event.id} />
        </div>
      </Tab>
    </HerouiTabs>
  )
}
