import type { Params } from 'react-router-dom'
import { defer, useLoaderData } from 'react-router-dom'
import { stringify } from '../scripts/util'
import { user } from '../api/router'
import type { User } from '../types/User'

export default function RouteUser() {
  const { data } = useLoaderData() as { data: User }

  return (
    <div>
      <pre>{stringify(data)}</pre>
    </div>
  )
}

export function routeUserLoader({ params }: { params: Params<'userId'> }) {
  return defer({
    data: user.get(params.userId),
  })
}
