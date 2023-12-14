import { useId, useLayoutEffect, useRef, useState } from 'react'

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

  // Store the label width when switching values
  const labelRef = useRef<HTMLLabelElement>(null)
  const [labelWidth, setLabelWidth] = useState<number>()

  useLayoutEffect(() => {
    if (labelRef.current) {
      setLabelWidth(labelRef.current.getBoundingClientRect().width)
    }
  })

  return (
    <div
      className="form-item form-slider"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <label
        ref={labelRef}
        htmlFor={id}
        aria-label={label}
        style={{ width: labelWidth ? `${labelWidth}px` : 'auto' }}
      >
        {hovering ? value : label}
      </label>
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
