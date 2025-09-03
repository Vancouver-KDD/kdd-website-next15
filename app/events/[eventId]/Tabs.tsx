'use client'
import {Tab, Tabs as HerouiTabs} from '@heroui/tabs'
import {Event} from '@/firebase/types'
import {Image} from '@heroui/image'

export default function Tabs({event}: {event: Event}) {
  return (
    <HerouiTabs disabledKeys={['reviews', 'photos']}>
      <Tab key="details" title="행사 디테일" className="text-medium">
        <div className="grid grid-cols-1 gap-10 py-7 md:grid-cols-2">
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
      <Tab key="reviews" title="행사 후기" className="text-medium">
        <div></div>
      </Tab>
      <Tab key="photos" title="사진첩" className="text-medium">
        <div></div>
      </Tab>
    </HerouiTabs>
  )
}
