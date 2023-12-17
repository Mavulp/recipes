import { useCssVar } from '../hooks/useCssVar'
import { useLocalState } from '../hooks/useStorage'
import { classes } from '../scripts/util'
import IconClose from './icons/IconClose'

interface Props {
  text: string
  type?: 'note' | 'success' | 'error' | 'warning'
  // If message stays the same, but we want to invalidate storage, we can pass in a key
  revokeKey?: string | number
}

export default function Alert({ type = 'note', text, revokeKey }: Props) {
  const [isClosed, setIsClosed] = useLocalState(text + revokeKey, false)

  const [color] = useCssVar(`--color-${type === 'note' ? 'accent' : type}`)

  // If this specific tooltip is closed, do not open it again
  if (isClosed)
    return null

  return (
    <div className={classes(['alert', `type-${type}`])} style={{ backgroundColor: color }}>
      <strong className="alert-badge">{type}</strong>
      <p>{text}</p>

      <button className="btn-hover btn-icon" onClick={() => setIsClosed(true)}>
        <IconClose />
      </button>
    </div>
  )
}
