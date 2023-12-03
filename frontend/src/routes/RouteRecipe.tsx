import type { Params } from 'react-router-dom'
import { Await, defer, useLoaderData } from 'react-router-dom'
import { Suspense } from 'react'
import { recipes } from '../api/recipes'
import { SimpleLoading } from '../components/loading/SimpleLoading'
import type { Recipe } from '../types/Recipe'
import DetailTime from '../components/detail/DetailTime'
import DetailIngredients from '../components/detail/DetailIngredients'
import DetailSteps from '../components/detail/DetailSteps'
import IconArrowLeft from '../components/icons/IconArrowLeft'

export default function RouteRecipe() {
  const { data } = useLoaderData() as { data: Recipe }
  return (
    <>
      <Suspense fallback={<SimpleLoading label="Loading Recipe" />}>
        <Await resolve={data}>
          {(data: Recipe) => (
            <div className="route route-recipe">
              <button className="btn-hover back" data-title-top="Back to recipes">
                <IconArrowLeft />
              </button>

              {data.image_url && <img src={data.image_url} alt={data.name} />}

              <div className="recipe-container">
                <ul className="time-list">
                  <DetailTime time={data.work_time} label="Work time" />
                  <DetailTime time={data.wait_time} label="Wait time" />
                </ul>

                <h1>{data.name}</h1>
                {data.description && <p className="description">{data.description}</p>}

                <DetailIngredients ingredients={data.ingredients} servings={data.servings} />
                <DetailSteps steps={data.steps} />
              </div>
            </div>
          )}
        </Await>
      </Suspense>
    </>
  )
}

export function routeRecipeLoader({ params }: { params: Params<'recipeId'> }) {
  return defer({
    data: recipes.get<Recipe>(params.recipeId),
  })
}
