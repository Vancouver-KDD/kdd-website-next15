'use client'

import {Listbox, ListboxItem} from '@heroui/listbox'
import {Popover, PopoverContent, PopoverTrigger} from '@heroui/popover'
import {Button} from '@heroui/button'
import {useRouter} from 'next/navigation'
import {Key} from 'react'

export default function ManageDropdown() {
  const router = useRouter()

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button color="secondary" variant="solid">
          Manage
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <Listbox
          aria-label="Manage Actions"
          disabledKeys={['speakers']}
          onAction={(key: Key) => {
             if (key === 'events') router.push('/admin/events')
             if (key === 'studies') router.push('/admin/studies')
          }}
          itemClasses={{
            base: 'gap-3',
          }}
        >
          <ListboxItem
            key="events"
            startContent={<span className="text-xl">📅</span>}
          >
            Manage Events
          </ListboxItem>
          <ListboxItem
            key="studies"
            startContent={<span className="text-xl">📚</span>}
          >
            Manage Studies
          </ListboxItem>
          <ListboxItem
            key="speakers"
            startContent={<span className="text-xl">🎤</span>}
          >
            Manage Speakers
          </ListboxItem>
        </Listbox>
      </PopoverContent>
    </Popover>
  )
}
