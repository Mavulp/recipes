import { Await, defer, useLoaderData } from "react-router-dom";
import { ingredients } from "../api/router";
import { Suspense } from "react";
import Spinner from "../components/loading/Spinner";
import { Ingredient } from "../types/Ingredient";
import { stringify } from "../scripts/util";

// Route handler, simply fetch and display loading / data
export default function RouteIngredients() {
  const { data } = useLoaderData() as { data: Ingredient[] }
  return (
    <div className="route route-ingredients">
      <h1 className="underline">Ingredients</h1>
      <Suspense fallback={<Spinner text="Loading Angredients" />}>
        <Await resolve={data}>
          {data => (<RouteIngredientHandler data={data} />)}
        </Await>
      </Suspense>
    </div>
  )
}

export function routeIngredientsLoader() {
  return defer({
    data: ingredients.get()
  })
}

// Actual route logic and implementation
function RouteIngredientHandler({ data }: { data: Ingredient[] }) {
  return (
    <pre>{stringify(data)}</pre>
  )
}

