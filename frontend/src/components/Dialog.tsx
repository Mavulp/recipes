import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import IconClose from './icons/IconClose'

interface Props {
  children: ReactNode
  onClose: () => void
}

const root = document.querySelector(':root')!

export default function Dialog({ children, onClose }: Props) {
  useEffect(() => {
    root.classList.add('noscroll')

    function handler({ key }: KeyboardEvent) {
      if (key === 'Escape')
        close()
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  })

  function close() {
    root.classList.remove('noscroll')
    onClose()
  }

  return (
    createPortal(
      <div
        className="dialog-wrap"
        onClick={(e) => {
          e.stopPropagation()
          // Close only if clicked on itself but not children
          if (e.target === e.currentTarget)
            close()
        }}
      >
        <div className="dialog-content">
          <button className="btn-hover btn-icon dialog-close" onClick={close}>
            <IconClose />
          </button>

          {children}
        </div>
      </div>,
      document.body,
    )
  )
}
