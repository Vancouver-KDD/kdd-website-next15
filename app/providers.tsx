'use client'
import * as React from 'react'

import {HeroUIProvider} from '@heroui/system'
import {ToastProvider} from '@heroui/toast'
import type {Route} from 'next'
import type {ThemeProviderProps} from 'next-themes'
import {ThemeProvider as NextThemesProvider} from 'next-themes'
import {useRouter} from 'next/navigation'

export interface ProvidersProps {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>
  }
}

export function Providers({children, themeProps}: ProvidersProps) {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={(path, options) => router.push(path as Route, options)}>
      <ToastProvider />
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  )
}
