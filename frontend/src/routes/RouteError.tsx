import { useRouteError } from 'react-router-dom'

export default function RouteError() {
  const err = useRouteError()

  return (
    <div className="route-error">
      <h1>Error!</h1>
      <p>{String(err)}</p>
    </div>
  )
}
