import { Await, defer, useLoaderData, useRouteLoaderData } from 'react-router-dom'
import { Suspense } from 'react'
import { recipes } from '../api/recipes'
import { stringify } from '../scripts/util'
import type { LoaderData } from '../scripts/type-utils'
import { SimpleLoading } from '../components/loading/SimpleLoading'

export default function RouteHome() {
  // TODO: how to type this?
  const { data } = useLoaderData() as LoaderData<typeof routeHomeLoader>

  return (
    <div>
      <h1>Recipes</h1>
      <Suspense fallback={<SimpleLoading label="Loading All Recipes" />}>
        <Await resolve={data}>
          <pre>{stringify(data)}</pre>
        </Await>
      </Suspense>
    </div>
  )
}

export function routeHomeLoader() {
  return defer({
    data: recipes.get('/people'),
  })
}
