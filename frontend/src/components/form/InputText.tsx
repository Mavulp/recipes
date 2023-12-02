import type { ReactNode } from 'react'
import { useId, useMemo } from 'react'
import { classes } from '../../scripts/util'
import IconSearch from '../icons/IconSearch'

interface Props {
  value: string | null | number
  setter: (value: string) => void
  name?: string
  label?: string | ReactNode
  placeholder?: string
  type?: string
  search?: boolean
}

export default function InputText({ value, setter, name, label, placeholder = '', type = 'text', search = false }: Props) {
  const formItemId = useId()
  const hasInput = useMemo(() => !!value && String(value).length > 0, [value])

  return (
    <div className={classes(['form-item text', { search }])}>
      {
        label && (
          <label htmlFor={formItemId}>
            { typeof label === 'string'
              ? label
              : <label /> }
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
        onInput={event => setter((event.target as HTMLInputElement).value)}
      />
    </div>
  )
}
