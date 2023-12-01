import { Await, defer, useLoaderData } from 'react-router-dom'
import { Suspense, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { Recipe } from '../types/Recipe'
import { recipes } from '../api/recipes'
import { SimpleLoading } from '../components/loading/SimpleLoading'
import { RecipeItem } from '../components/recipes/RecipeItem'
import TextInput from '../components/form/TextInput'
import type { RootState } from '../store'
import { setFilter } from '../store/filters'
import { searchInStr } from '../scripts/util'

export async function routeRecipesLoader() {
  return defer({ data: recipes.get<Recipe[]>() })
}

export default function RouteRecipes() {
  // TODO: this is the only way to type this as I found out
  const { data } = useLoaderData() as { data: Recipe[] }

  // Filters
  const search = useSelector((state: RootState) => state.filters.search)
  const dispatch = useDispatch()

  return (
    <div className="route route-home">
      <h1>Recipes</h1>

      {/* Search, filtering, tags etc */}
      <div className="filters">
        <TextInput
          value={search}
          setter={value => dispatch(setFilter(value))}
          placeholder="Search recipes"
        />
      </div>

      <Suspense fallback={<SimpleLoading label="Loading All Recipes" />}>
        <Await resolve={data}>
          {data => (
            <RecipeWrapper data={data} />
          ) }
        </Await>
      </Suspense>
    </div>
  )
}

// Child component which filters on and counts amount of articles
function RecipeWrapper({ data }: { data: Recipe[] }) {
  const search = useSelector((state: RootState) => state.filters.search)

  const filteredData = useMemo(() => {
    return data.filter(res => searchInStr(res.name, search))
  }, [search, data])

  return (
    <>
      <p>
        {filteredData.length}
        results
      </p>
      { filteredData.map(item => (<RecipeItem key={item.name} data={item} />)) }
    </>
  )
}
