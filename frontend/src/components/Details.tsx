import { type ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { classes } from '../scripts/util'

interface Props {
  header: ReactNode
  open?: boolean
  children: ReactNode
}

export default function Details({ header, open: _open = false, children }: Props) {
  const content = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(_open)
  const [maxH, setMaxH] = useState<number>()

  useLayoutEffect(() => {
    setMaxH(open
      ? content.current?.scrollHeight
      : 0,
    )
  }, [open])

  return (
    <div className={classes([
      'btn-details',
      { open },
    ])}
    >
      <button onClick={() => setOpen(v => !v)}>
        {header}
      </button>
      <div className="btn-detail-content" ref={content} style={{ maxHeight: maxH ? `${maxH}px` : 0 }}>
        {children}
      </div>
    </div>
  )
}
