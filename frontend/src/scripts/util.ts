export function stringify(data: unknown) {
  return JSON.stringify(data, null, 2)
}

// This will serialize vue-like class object/arrays into a string
// So that the little cry-baby react can consume it uwu
type ClassObject = Record<string, boolean>

export function classes(items: string | ClassObject | Array<string | ClassObject>) {
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

// Detect if value is primitive

// Some basic time utilities. Converts the provided date type to milliseconds
export const seconds = (amount: number) => amount * 1000
export const minutes = (amount: number) => seconds(amount * 60)
export const hours = (amount: number) => minutes(amount * 60)
export const days = (amount: number) => hours(amount * 24)
