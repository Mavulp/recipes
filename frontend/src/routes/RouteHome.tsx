import { Await, defer, useLoaderData } from 'react-router-dom'
import { Suspense } from 'react'
import type { Recipe } from '../api/recipes'
import { recipes } from '../api/recipes'
import { SimpleLoading } from '../components/loading/SimpleLoading'
import { RecipeItem } from '../components/recipes/RecipeItem'

export default function RouteHome() {
  // TODO: this is the only way to type this as I found out
  const { data } = useLoaderData() as { data: Recipe }

  return (
    <div className="route route-home">
      <h1>Recipes</h1>
      <Suspense fallback={<SimpleLoading label="Loading All Recipes" />}>
        <Await resolve={data}>
          {data => data.results.map((result: Recipe['results'][number]) => <RecipeItem key={result.name} data={result} />) }
        </Await>
      </Suspense>
    </div>
  )
}

export async function routeHomeLoader() {
  return defer({ data: recipes.get<Recipe>('/people') })
}
