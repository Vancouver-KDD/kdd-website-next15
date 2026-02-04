'use client'
import {useI18nStore} from '@/lib/i18n'
import {Button} from '@heroui/button'
import {Listbox, ListboxItem} from '@heroui/listbox'
import {Popover, PopoverContent, PopoverTrigger} from '@heroui/popover'
import {Globe} from 'lucide-react'
import {useState} from 'react'

export const LanguageSwitch = () => {
  const {locale, setLocale} = useI18nStore()
  const [isOpen, setIsOpen] = useState(false)

  const items = [
    {key: 'ko', label: '한국어 (KO)'},
    {key: 'en', label: 'English (EN)'},
  ]

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-end">
      <PopoverTrigger>
        <Button
          className="bg-default-100 text-default-600 font-bold"
          radius="full"
          variant="flat">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-default-500" />
            <div className="bg-default-300 h-3 w-[1px]" />
            <span>{locale === 'en' ? 'EN' : 'KO'}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[140px] p-1">
        <Listbox
          aria-label="Select Language"
          variant="flat"
          onAction={(key) => {
            setLocale(key as any)
            setIsOpen(false)
          }}>
          {items.map((item) => (
            <ListboxItem
              key={item.key}
              className={locale === item.key ? 'text-primary font-bold' : ''}>
              {item.label}
            </ListboxItem>
          ))}
        </Listbox>
      </PopoverContent>
    </Popover>
  )
}
