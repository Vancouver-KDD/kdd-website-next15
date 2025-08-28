'use client'
import {Button} from '@heroui/button'
import {UpArrowIcon} from './icons'

export default function JumpToTopButton() {
  return (
    <Button
      onPress={() => {
        window.scrollTo({top: 0, behavior: 'smooth'})
      }}
      isIconOnly
      radius="full"
      className="bg-default-900 text-background fixed right-10 bottom-10 z-50 h-16 w-16">
      <UpArrowIcon size={36} />
    </Button>
  )
}
