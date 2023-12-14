import { Await, defer, useLoaderData } from 'react-router-dom'
import { Suspense, useMemo } from 'react'
import { ingredients } from '../api/router'
import Spinner from '../components/loading/Spinner'
import type { Ingredient } from '../types/Ingredient'
import IngredientGroup from '../components/ingredients/IngredientGroup'

// Route handler, simply fetch and display loading / data
export default function RouteIngredients() {
  const { data } = useLoaderData() as { data: Ingredient[] }
  return (
    <div className="route route-ingredients">
      <h1 className="underline">Ingredients</h1>
      <Suspense fallback={<Spinner text="Loading Angredients" />}>
        <Await resolve={data}>
          {data => (<IngredientListManager data={data} />)}
        </Await>
      </Suspense>
    </div>
  )
}

export function routeIngredientsLoader() {
  return defer({
    data: ingredients.get<Ingredient[]>(),
  })
}

// Actual route logic and implementation
function IngredientListManager({ data }: { data: Ingredient[] }) {
  const grouped = Object.groupBy(
    // First sort the data array alphabetically
    data.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase ? 1 : -1),
    // Group ingredients by their starting letter
    ({ name }) => name[0].toLowerCase(),
  )

  return (
    <div className="ingredients-list">
      <ul className="list-grid">
        {Object.keys(grouped).map(key => (
          <IngredientGroup key={key} letter={key} items={grouped[key]} />
        ))}
      </ul>
    </div>
  )
}
