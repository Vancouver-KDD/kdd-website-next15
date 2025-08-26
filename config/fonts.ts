import {Fira_Code as FontMono} from 'next/font/google'
import localFont from 'next/font/local'

export const fontSans = localFont({
  src: './PretendardVariable.woff2',
  weight: '45 920',
  variable: '--font-sans',
  preload: true,
})

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
})
