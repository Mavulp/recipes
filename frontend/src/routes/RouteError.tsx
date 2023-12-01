import { useRouteError } from 'react-router-dom'

export function RouteError() {
  const err = useRouteError()

  return (
    <div>
      <h1>Errror!</h1>
      <p>{String(err)}</p>
    </div>
  )
}
