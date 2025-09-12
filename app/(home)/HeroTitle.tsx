'use client'
import Typewriter from 'typewriter-effect'

export function KoreanTitle() {
  return (
    <Typewriter
      options={{
        strings: ['orean.   ', 'nowledge.'],
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
        strings: ['eveloper.', 'iversity.'],
        autoStart: true,
        loop: true,
        deleteSpeed: 0,
        cursor: '',
      }}
    />
  )
}

export function DesignerTitle() {
  return (
    <Typewriter
      options={{
        strings: ['esigner. ', 'rive.    '],
        autoStart: true,
        loop: true,
        deleteSpeed: 0,
        cursor: '',
      }}
    />
  )
}
