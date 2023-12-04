import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { classes, searchInStr } from '../../scripts/util'
import InputText from './InputText'

/**
 * Options template:
 * {
 *    'Label 1': whateverHappens()
 * }
 */
interface Props {
  options: Record<string, () => void>
  children?: ReactNode
  selected?: string
  label?: string
}

export default function SingleSelect({ options, children, selected, label }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState<string | null>(null)

  function onSelect(fn: () => void) {
    fn()
    setOpen(false)
    setSearch(null)
  }

  const filterOptions = useMemo(() => {
    return Object.keys(options)
      // only return keys which match the search
      .filter(key => searchInStr(key, search))
      // FOrmat back to Record
      .reduce((group, key) => {
        group[key] = options[key]
        return group
      }, {} as Props['options'])
  }, [options, search])

  return (
    <div className={classes(['dropdown-wrap', { 'has-selected': !!selected }])}>
      <button onClick={() => setOpen(!open)}>
        {children || (
          <InputText
            label={label}
            value={null}
            setter={setSearch}
            placeholder={selected ?? 'Select an item'}
          />
        )}
      </button>
      {
       open
       && (
         <div className="dropdown">
           {
            Object.entries(filterOptions).map(([label, handler]) => (
              <button
                key={label}
                onClick={_ => onSelect(handler)}
                className={classes(['button', { 'is-selected': selected === label }])}
                // This should be acceptable, we're simply appending a <b> to a string
                dangerouslySetInnerHTML={{ __html:
                  search
                    ? label.replaceAll(search, `<b>${search}</b>`)
                    : label,
                }}
              >
              </button>
            ))
          }
         </div>
       )
      }
    </div>
  )
}
