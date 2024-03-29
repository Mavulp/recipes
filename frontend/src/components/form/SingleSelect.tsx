import type { ReactNode } from 'react'
import { useMemo, useRef, useState } from 'react'
import { classes, searchInStr } from '../../scripts/util'
import { useClickOutside } from '../../hooks/useClickOutside'
import IconKeyDown from '../icons/IconKeyDown'
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
  selected?: string | null
  label?: string
  noResults?: ReactNode
}

export default function SingleSelect({ options, children, selected, label, noResults }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState<string | null>(null)

  function onSelect(fn: () => void) {
    fn()
    setOpen(false)
    setSearch(null)
  }

  const filterOptions = useMemo(() => {
    return Object.entries(Object.keys(options)
      // only return keys which match the search
      .filter(key => searchInStr(key, search))
      // Format back to Record
      .reduce((group, key) => {
        group[key] = options[key]
        return group
      }, {} as Props['options']))
  }, [options, search])

  // Click outside
  const wrapper = useRef<HTMLDivElement>(null)
  useClickOutside(wrapper, () => setOpen(false))

  return (
    <div className={classes(['dropdown-wrap', { 'has-selected': !!selected, open }])} ref={wrapper}>
      <button onClick={() => setOpen(!open)}>
        {children || (
          <InputText
            label={label}
            value={null}
            setter={setSearch}
            placeholder={selected ?? 'Select an item'}
          />
        )}
        <IconKeyDown />
      </button>
      {
        open
        && (
          <div className="dropdown">
            {
              // List dropdown options
              filterOptions.map(([label, handler]) => (
                <button
                  key={label}
                  onClick={_ => onSelect(handler)}
                  className={classes(['button', { 'is-selected': selected === label }])}
                  // This should be acceptable, we're simply appending a <b> to a string
                  dangerouslySetInnerHTML={{
                    __html:
                      search
                        ? label.toLowerCase().replaceAll(search.toLowerCase(), `<b>${search}</b>`)
                        : label,
                  }}
                >
                </button>
              ))
            }
            {
              // Optionally, we can show some piece of UI if no filter options are available
              filterOptions.length === 0 && (noResults)
            }
          </div>
        )
      }
    </div>
  )
}
