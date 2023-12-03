import type { ChangeEvent } from 'react'
import { useId } from 'react'
import IconCheck from '../icons/IconCheck'

type ValueFn<T = unknown> = (value: T) => void

interface Props {
  value: boolean | null
  label: string
  setter?: ValueFn<boolean>
}

export default function InputCheckbox({ value, label, setter }: Props) {
  const id = useId()

  function update(e: ChangeEvent<HTMLInputElement>) {
    if (setter)
      setter((e.target as HTMLInputElement).checked)
  }

  return (
    <div className="form-checkbox">
      <input
        type="checkbox"
        id={id}
        name={id}
        defaultChecked={Boolean(value)}
        onChange={v => update(v)}
      />
      <label htmlFor={id}>
        <span className="icon">
          <IconCheck />
        </span>

        {label}
      </label>
    </div>
  )
}
