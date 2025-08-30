'use client'
import Typewriter from 'typewriter-effect'

export function KoreanTitle() {
  return (
    <Typewriter
      options={{
        strings: ['Knowledge.', 'Korean.   '],
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
        strings: ['Diversity.', 'Developer.'],
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
        strings: ['Drive.    ', 'Design.   '],
        autoStart: true,
        loop: true,
        deleteSpeed: 0,
        cursor: '',
      }}
    />
  )
}
