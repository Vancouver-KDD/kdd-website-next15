import {Fira_Code as FontMono} from 'next/font/google'
import localFont from 'next/font/local'

export const pretendard = localFont({
  src: './PretendardVariable.woff2',
  weight: '45 920',
  style: 'normal',
  display: 'swap',
  variable: '--font-sans',
})

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
})
