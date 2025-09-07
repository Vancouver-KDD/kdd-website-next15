'use client'
import {useEffect, useState} from 'react'
import {Tab, Tabs as HerouiTabs} from '@heroui/tabs'
import {Event} from '@/firebase/types'
import {Image} from '@heroui/image'
import Photos from './(photos)/Photos'
import {useAuthStore} from '@/firebase/AuthClient'

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

export default function Tabs({event}: {event: Event}) {
  // Get key after # for example http://localhost:3000/events/rtvOYkyRMKK4F6fDEsNn#details
  const {admin} = useAuthStore()
  const [selected, setSelected] = useState(TABS[0].key)
  const disabledKeys = [
    TABS[1].key,
    ...((event.photos && event.photos.length > 0) || admin ? [] : [TABS[2].key]),
  ]

  // Initialize selected tab from hash on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = window.location.hash.split('#')[1] || TABS[0].key
      if (disabledKeys.includes(key) || !TABS.some((tab) => tab.key === key)) {
        window.location.hash = TABS[0].key
        setSelected(TABS[0].key)
      } else {
        setSelected(key)
      }
    }
  }, [disabledKeys])

  // Detect when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const key = window.location.hash.split('#')[1] || TABS[0].key
      if (disabledKeys.includes(key) || !TABS.some((tab) => tab.key === key)) {
        window.location.hash = TABS[0].key
        setSelected(TABS[0].key)
      } else {
        setSelected(key)
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [disabledKeys])

  return (
    <HerouiTabs
      disabledKeys={disabledKeys}
      selectedKey={selected}
      onSelectionChange={(key) => {
        window.location.hash = key as string
      }}>
      <Tab key={TABS[0].key} title={TABS[0].title} className="text-medium">
        <div className="grid grid-cols-1 gap-10 py-8 md:grid-cols-2">
          {!!event.image && (
            <Image
              src={event.image ?? ''}
              alt={'poster'}
              shadow="lg"
              removeWrapper
              className="h-auto rounded-lg object-contain"
            />
          )}
          <div className="text-start font-normal whitespace-pre-line">{event.description}</div>
        </div>
      </Tab>
      <Tab key={TABS[1].key} title={TABS[1].title} className="text-medium">
        <div></div>
      </Tab>
      <Tab key={TABS[2].key} title={TABS[2].title} className="text-medium">
        <div className="py-8">
          {!!event.photos && <Photos photos={event.photos} eventId={event.id} />}
        </div>
      </Tab>
    </HerouiTabs>
  )
}
