import type { RefObject } from 'react'
import { useCallback, useEffect } from 'react'

export function useClickOutside(wrapper: RefObject<HTMLElement>, cb: () => void) {
  const handler = useCallback((e: MouseEvent) => {
    if (e.target && wrapper.current && !wrapper.current.contains(e.target as HTMLElement))
      cb()
  }, [wrapper])

  function stop() {
    document.removeEventListener('click', handler)
  }

  useEffect(() => {
    document.addEventListener('click', handler)
    return stop
  })

  return stop
}
