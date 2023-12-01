import type { Params } from 'react-router-dom'
import { Await, defer, useLoaderData } from 'react-router-dom'
import { Suspense } from 'react'
import { recipes } from '../api/recipes'
import { stringify } from '../scripts/util'
import { SimpleLoading } from '../components/loading/SimpleLoading'
import type { LoaderData } from '../scripts/type-utils'

export default function RouteRecipe() {
  const { data } = useLoaderData() as LoaderData<typeof routeRecipeLoader>
  return (
    <>
      <Suspense fallback={<SimpleLoading label="Loading Recipe" />}>
        <Await resolve={data}>
          <pre>{stringify(data)}</pre>
        </Await>
      </Suspense>
    </>
  )
}

export function routeRecipeLoader({ params }: { params: Params<'recipeId'> }) {
  return defer({
    data: recipes.get(`/${params.recipeId}`),
  })
}
