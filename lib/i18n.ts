'use client'
import {useEffect, useState} from 'react'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

export type Locale = 'en' | 'ko'

interface I18nState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      locale: 'ko',
      setLocale: (locale) => set({locale}),
    }),
    {
      name: 'kdd-language-storage',
    }
  )
)

// Simple translation helper for use in components
export const useTranslation = (dictionary: any) => {
  const [mounted, setMounted] = useState(false)
  const locale = useI18nStore((state) => state.locale)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentLocale = mounted ? locale : 'ko'

  const t = (key: string) => {
    const keys = key.split('.')
    let current = dictionary[currentLocale]
    for (const k of keys) {
      if (current && current[k] !== undefined) {
        current = current[k]
      } else {
        return key // fallback to key
      }
    }
    return current
  }
  return {t, locale: currentLocale}
}
