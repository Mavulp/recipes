import type { ReactNode } from 'react'
import { useId, useMemo } from 'react'
import { classes } from '../../scripts/util'
import IconSearch from '../icons/IconSearch'

interface Props {
  value?: string | null
  setter?: (value: string) => void
  name?: string
  label?: string | ReactNode
  placeholder?: string
  search?: boolean
}

export default function InputTextarea({ value, setter, name, label, placeholder = '', search = false }: Props) {
  const formItemId = useId()
  const hasInput = useMemo(() => !!value && value.length > 0, [value])

  return (
    <div className={classes(['form-item text', { search }])}>
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

      <textarea
        className={classes({ 'has-input': hasInput })}
        id={formItemId}
        name={name ?? formItemId}
        defaultValue={value ?? ''}
        placeholder={placeholder}
        onInput={(event) => {
          if (setter)
            setter((event.target as HTMLInputElement).value)
        }}
      />
    </div>
  )
}
