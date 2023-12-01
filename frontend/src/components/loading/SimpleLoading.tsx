interface Props {
  label: string
}

export function SimpleLoading({ label }: Props) {
  return (
    <div className="simple-loading">
      <span>{ label }</span>
    </div>
  )
}
