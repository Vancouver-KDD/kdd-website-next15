'use client'
import {Button} from '@heroui/button'
import {UpArrowIcon} from './icons'
import {useState, useEffect} from 'react'

export default function JumpToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const halfScroll = documentHeight / 2

      setIsVisible(scrollTop > halfScroll)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

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
