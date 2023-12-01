import type { ReactNode } from 'react'
import { useState } from 'react'
import { classes } from '../../scripts/util'

/**
 * The usage works like this
 * {
 *    'Label 1': whateverHappens
 * }
 */
interface Props {
  options: Record<string, () => void>
  children: ReactNode
  selected?: string
}

export default function SingleSelect({ options, children, selected }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(!open)}>
        {children}
      </button>
      {
       open
       && (
         <div className="dropdown">
           {
            Object.entries(options).map(([label, handler]) => (
              <button
                key={label}
                onClick={() => handler()}
                className={classes({ 'is-selected': selected === label })}
              >
                {label}
              </button>
            ))
          }
         </div>
       )
      }
    </>
  )
}
