'use client'

import {useI18nStore} from '@/lib/i18n'
import {useEffect} from 'react'

export const LanguageSync = () => {
  const locale = useI18nStore((state) => state.locale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}
