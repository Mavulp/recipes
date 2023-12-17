import type { Params } from 'react-router-dom'
import { Await, defer, useLoaderData, useNavigate } from 'react-router-dom'
import { Suspense } from 'react'
import { recipes } from '../api/router'
import { SimpleLoading } from '../components/loading/SimpleLoading'
import type { Recipe } from '../types/Recipe'
import DetailTime from '../components/detail/DetailTime'
import DetailIngredients from '../components/detail/DetailIngredients'
import DetailSteps from '../components/detail/DetailSteps'
import IconArrowLeft from '../components/icons/IconArrowLeft'
import Alert from '../components/Alert'
import Reviews from '../components/reviews/Reviews'
import type { Review } from '../types/Review'

export default function RouteRecipe() {
  const { data, reviews } = useLoaderData() as {
    data: Recipe
    reviews: Review[]
  }

  return (
    <>
      <Suspense fallback={<SimpleLoading label="Loading Recipe" />}>
        <Await resolve={Promise.all([data, reviews])}>
          {([data, reviews]: [Recipe, Review[]]) => (<RecipeDetailHandler data={data} reviews={reviews} />)}
        </Await>
      </Suspense>
    </>
  )
}

interface Props {
  data: Recipe
  reviews: Review[]
}

function RecipeDetailHandler({ data, reviews }: Props) {
  const navigate = useNavigate()
  // const [accent, setAccent] = useCssVar('--color-accent')
  // const defaultAccent = accent

  // Before we leave the route, reset back to default --color-accent
  // useBeforeUnload(useCallback(() => {
  //   setAccent(defaultAccent)
  // }, [defaultAccent, setAccent]))

  // useEffect(() => {
  //   // Get the most saturated pixel
  //   if (data.image_url) {
  //     getColorFromThumbnail(data.image_url)
  //       .then((newColor) => {
  //         setAccent(newColor)
  //       })
  //   }
  // }, [])

  return (
    <div className="route route-recipe">
      <button className="btn-hover back" data-title-top="Go Back" onClick={() => navigate('/recipes')}>
        <IconArrowLeft />
      </button>

      <Alert
        revokeKey={data.id}
        type="warning"
        text="The recipe contains an ingredient, which you have blacklisted. Please proceed with caution."
      />

      {data.image_url && <img className="banner" src={data.image_url} alt={data.name} />}

      <div className="recipe-container">
        <ul className="time-list">
          <DetailTime time={data.work_time} label="Work time" />
          <DetailTime time={data.wait_time} label="Wait time" />
        </ul>

        <h1>{data.name}</h1>
        {data.description && <p className="description">{data.description}</p>}

        <DetailIngredients ingredients={data.ingredients} servings={data.servings} />
        <DetailSteps steps={data.steps} />

        <hr className="hr-48" />

        <Reviews reviews={reviews} recipeId={data.id} />
      </div>
    </div>
  )
}

export function routeRecipeLoader({ params }: { params: Params<'recipeId'> }) {
  return defer({
    data: recipes.get<Recipe>(params.recipeId),
    reviews: recipes.get<Review[]>(`${params.recipeId}/review`),
  })
}
