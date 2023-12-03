import { classes } from '../../scripts/util'

interface Props {
  text?: string
  light?: boolean
}

export default function Spinner({ text, light }: Props) {
  return (
    <div className={classes(['spinner-wrap', { light: light === true }])}>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <span>{text}</span>}
    </div>
  )
}
