import { useId, useState } from 'react'

interface Props {
  min?: number
  max?: number
  value: number
  label: string
  setter: (value: number) => void
}

export default function InputSlider({ value, label, setter, ...attrs }: Props) {
  const id = useId()

  // Store the positions
  const [hovering, setHovering] = useState(false)

  return (
    <div
      className="form-item form-slider"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <label htmlFor={id} aria-label={label}>{hovering ? value : label}</label>
      <input
        id={id}
        name={id}
        type="range"
        defaultValue={value}
        aria-label="Slider"
        {...attrs}
        onChange={e => setter(Number((e.target as HTMLInputElement).value))}
      />
    </div>
  )
}
