import type { RefObject } from 'react'
import { useCallback, useEffect } from 'react'

export function useClickOutside(wrapper: RefObject<HTMLElement>, cb: () => void) {
  const handler = useCallback((e: MouseEvent) => {
    if (e.target && wrapper.current && !wrapper.current.contains(e.target as HTMLElement))
      cb()
  }, [wrapper])

  useEffect(() => {
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  })
}
