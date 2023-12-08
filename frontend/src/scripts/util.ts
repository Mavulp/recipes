export function stringify(data: unknown) {
  return JSON.stringify(data, null, 2)
}

export function isNil(val: any) {
  return val === undefined || val === null
}

// This will serialize vue-like class object/arrays into a string
// So that the little cry-baby react can consume it uwu
export type ClassObject = Record<string, boolean>
export type Classes = string | ClassObject | Array<string | ClassObject>

export function classes(items: Classes) {
  const classes: string[] = []

  function runObject(obj: ClassObject) {
    Object.entries(obj).forEach(([key, value]) => {
      if (Boolean(value) === true)
        classes.push(key)
    })
  }

  switch (true) {
    case typeof items === 'string': {
      return items
    }
    case Array.isArray(items): {
      for (const item of items) {
        if (typeof item === 'string')
          classes.push(item)

        else
          runObject(item)
      }
      break
    }
    case typeof items === 'object': {
      runObject(items)
    }
  }

  return classes.join(' ')
}

// Splits a string into words and the compares them to the search query
export function searchInStr(match: string | string[], search?: string | null) {
  if (!search)
    return true

  if (!match)
    return false

  const joint: string = Array.isArray(match) ? match.join(' ') : match
  const split = search.trim().split(/\s+/)

  return split.every(s => joint.toLowerCase().includes(s.toLowerCase()))
}

// Some basic time utilities. Converts the provided date type to milliseconds
export const seconds = (amount: number) => amount * 1000
export const minutes = (amount: number) => seconds(amount * 60)
export const hours = (amount: number) => minutes(amount * 60)
export const days = (amount: number) => hours(amount * 24)

// Takes a number and if it is only 1 digit, prepends a 0
export function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0')
}

export function formatDate(date: number) {
  const _date = new Date(date * 1000)

  return `${padTo2Digits(_date.getUTCHours())}:${padTo2Digits(_date.getUTCMinutes())}, ${_date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`
}

export function randomLightColor() {
  const h = Math.floor(Math.random() * 360)
  return `hsl(${h}deg, 50%, 30%)`
}

export function prefersDark() {
  return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
}
