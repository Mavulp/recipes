import { useEffect, useState } from 'react'

/**
 * Simple wrapper around
 */
export function useLocalState<T = undefined>(id: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)

  // This should run once?
  useEffect(() => {
    const existing = localStorage.getItem(id)
    if (existing) {
      try {
        setValue(JSON.parse(existing))
      }
      catch (e) {
        console.warn('Error parsing local state')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(id, JSON.stringify(value))
  }, [value])

  return [value, setValue]
}
