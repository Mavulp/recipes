import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

/**
 * Simple wrapper around local storage API mapped into reactive state
 */
export function useLocalState<T extends string, K = unknown>(id: T, defaultValue: K) {
  const [value, setValue] = useState<K>(() => {
    const item = localStorage.getItem(id)
    return item ? JSON.parse(item) : defaultValue
  })

  useEffect(() => {
    localStorage.setItem(id, JSON.stringify(value))
  }, [value])

  return [value, setValue] as [
    K,
    Dispatch<SetStateAction<K>>,
  ]
}
