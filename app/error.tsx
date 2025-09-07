'use client'
import posthog from 'posthog-js'
import {useEffect} from 'react'

export default function Error({error, reset}: {error: Error; reset: () => void}) {
  useEffect(() => {
    posthog.capture('error', {error: error.message})
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }>
        Try again
      </button>
    </div>
  )
}
