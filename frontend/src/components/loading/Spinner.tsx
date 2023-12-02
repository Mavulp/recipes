export default function Spinner({ text }: { text?: string }) {
  return (
    <div className="spinner-wrap">
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
