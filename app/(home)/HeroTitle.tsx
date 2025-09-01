'use client'
import Typewriter from 'typewriter-effect'

export function KoreanTitle() {
  return (
    <Typewriter
      options={{
        strings: ['nowledge.', 'orean.   '],
        autoStart: true,
        loop: true,
        deleteSpeed: 0,
        cursor: '',
      }}
    />
  )
}

export function DeveloperTitle() {
  return (
    <Typewriter
      options={{
        strings: ['iversity.', 'eveloper.'],
        autoStart: true,
        loop: true,
        deleteSpeed: 0,
        cursor: '',
      }}
    />
  )
}

export function DesignTitle() {
  return (
    <Typewriter
      options={{
        strings: ['rive.    ', 'esign.   '],
        autoStart: true,
        loop: true,
        deleteSpeed: 0,
        cursor: '',
      }}
    />
  )
}
