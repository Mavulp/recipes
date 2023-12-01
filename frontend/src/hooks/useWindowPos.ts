import { useEffect, useState } from 'react'

/**
 * Tracks user's scroll position.
 */

// TODO: add option to debounce the event listener
export default function useWindowPos() {
  const [x, setX] = useState(window.scrollX)
  const [y, setY] = useState(window.scrollY)

  function handle() {
    setX(window.scrollX)
    setY(window.scrollY)
  }

  useEffect(() => {
    window.addEventListener('scroll', handle, {
      capture: false,
      passive: true,
    })
    return () => {
      window.removeEventListener('scroll', handle)
    }
  }, [])

  return { x, y }
}
