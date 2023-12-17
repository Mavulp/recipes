import type { ReactNode } from 'react'
import { useId, useMemo } from 'react'
import type { Classes } from '../../scripts/util'
import { classes } from '../../scripts/util'
import IconSearch from '../icons/IconSearch'

interface Props {
  value?: string | null | number
  setter?: (value: string) => void
  name?: string
  label?: string | ReactNode
  placeholder?: string
  type?: string
  search?: boolean
  className?: Classes
}

export default function InputText({ value, setter, name, label, placeholder = '', type = 'text', search = false, className }: Props) {
  const formItemId = useId()
  const hasInput = useMemo(() => !!value && String(value).length > 0, [value])

  return (
    <div className={classes(['form-item text', { search }, classes(className)])}>
      {
        label && (
          <label htmlFor={formItemId}>
            {typeof label === 'string'
              ? label
              : <label />}
          </label>
        )
      }

      {search && <span className="icon-search"><IconSearch /></span>}

      <input
        className={classes({ 'has-input': hasInput })}
        id={formItemId}
        name={name ?? formItemId}
        type={type}
        defaultValue={value ?? ''}
        placeholder={placeholder}
        autoComplete="false"
        onInput={(event) => {
          if (setter)
            setter((event.target as HTMLInputElement).value)
        }}
      />
    </div>
  )
}
