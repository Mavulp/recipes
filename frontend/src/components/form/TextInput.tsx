import type { ReactNode } from 'react'
import { useId, useMemo } from 'react'
import { classes } from '../../scripts/util'

interface Props {
  value: string
  setter: (value: string) => void
  name?: string
  label?: string | ReactNode
  placeholder?: string
  type?: string
}

export default function TextInput({ value, setter, name, label, placeholder = '', type = 'text' }: Props) {
  const formItemId = useId()
  const hasInput = useMemo(() => value.length > 0, [value])

  return (
    <div className="form-item text">
      {
        label && (
          <label htmlFor={formItemId}>
            { typeof label === 'string'
              ? label
              : <label /> }
          </label>
        )
      }

      <input
        className={classes({ 'has-input': hasInput })}
        id={formItemId}
        name={name ?? formItemId}
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        onInput={event => setter((event.target as HTMLInputElement).value)}
      />
    </div>
  )
}
