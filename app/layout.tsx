import '@/styles/globals.css'

import JumpToTopButton from '@/components/JumpToTopButton'
import {Navbar} from '@/components/navbar'
import {fontSans} from '@/config/fonts'
import {siteConfig} from '@/config/site'
import AuthClient from '@/firebase/AuthClient'
import clsx from 'clsx'
import {Metadata, Viewport} from 'next'
import Footer from './Footer'
import {Providers} from './providers'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: 'white'},
    {media: '(prefers-color-scheme: dark)', color: 'black'},
  ],
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html suppressHydrationWarning lang="ko">
      <head />
      <body
        className={clsx(
          'text-foreground bg-background min-h-screen font-sans antialiased',
          fontSans.variable
        )}>
        <Providers themeProps={{attribute: 'class', defaultTheme: 'light'}}>
          <div className="relative flex h-screen flex-col">
            <Navbar />
            <main className="flex-grow pt-20 md:pt-30">{children}</main>
            <Footer />
            <JumpToTopButton />
            <AuthClient />
          </div>
        </Providers>
      </body>
    </html>
  )
}
