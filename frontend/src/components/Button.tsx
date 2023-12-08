import type { MouseEvent, ReactNode } from 'react'
import { type Classes, classes as cls } from '../scripts/util'
import Spinner from './loading/Spinner'

interface Props {
  children?: ReactNode
  onClick?: (event?: MouseEvent) => void
  loading?: boolean
  classes?: Classes
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function Button({
  children,
  onClick,
  loading,
  classes = [],
  type = 'button',
  disabled = false,
  // Collect all remaining attributes and apply them
  ...attrs
}: Props) {
  return (
    <button
      onClick={(e) => {
        if (onClick)
          onClick(e)
      }}
      className={cls(classes)}
      type={type}
      disabled={disabled}
      {...attrs}
    >
      { loading ? <Spinner /> : children }
    </button>
  )
}
