import type { Params } from 'react-router-dom'
import { Await, defer, useLoaderData } from 'react-router-dom'
import { Suspense } from 'react'
import { recipes } from '../api/recipes'
import { stringify } from '../scripts/util'
import { SimpleLoading } from '../components/loading/SimpleLoading'
import type { GetRecipe } from '../types/GetRecipe'

export default function RouteRecipe() {
  const { data } = useLoaderData() as { data: GetRecipe }
  return (
    <>
      <Suspense fallback={<SimpleLoading label="Loading Recipe" />}>
        <Await resolve={data}>
          {data => (
            <div className="route route-recipe">
              <h1>{data.name}</h1>
              <pre>{stringify(data)}</pre>
            </div>
          )}
        </Await>
      </Suspense>
    </>
  )
}

export function routeRecipeLoader({ params }: { params: Params<'recipeId'> }) {
  return defer({
    data: recipes.get<GetRecipe>(params.recipeId),
  })
}
