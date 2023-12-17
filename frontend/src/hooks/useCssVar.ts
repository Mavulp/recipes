import { useEffect, useState } from 'react'

export function useCssVar(varName: string) {
  const root = document.documentElement
  const [value, setValue] = useState<string>(getComputedStyle(root).getPropertyValue(varName))

  useEffect(() => {
    if ('style' in root)
      root.style.setProperty(varName, value)
  }, [value])

  return [
    value,
    setValue,
  ] as const
}
