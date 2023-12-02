import { Await, Link, defer, useLoaderData } from 'react-router-dom'
import { Suspense, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { Recipe } from '../types/Recipe'
import { recipes } from '../api/recipes'
import { SimpleLoading } from '../components/loading/SimpleLoading'
import { RecipeItem } from '../components/recipes/RecipeItem'
import InputText from '../components/form/InputText'
import type { RootState } from '../store'
import { setFilter } from '../store/filters'
import { classes, searchInStr } from '../scripts/util'
import useWindowPos from '../hooks/useWindowPos'

export default function RouteRecipes() {
  // TODO: this is the only way to type this as I found out
  const { data } = useLoaderData() as { data: Recipe[] }
  return (
    <div className="route route-home">
      <h1>All Recipes</h1>
      <Suspense fallback={<SimpleLoading label="Loading All Recipes" />}>
        <Await resolve={data}>
          {data => (
            <RecipeListManager data={data} />
          ) }
        </Await>
      </Suspense>
    </div>
  )
}

export async function routeRecipesLoader() {
  return defer({ data: recipes.get<Recipe[]>() })
}

// Child component which filters on and counts amount of articles
function RecipeListManager({ data }: { data: Recipe[] }) {
  const search = useSelector((state: RootState) => state.filters.search)
  const dispatch = useDispatch()

  const filteredData = useMemo(() => {
    return data.filter(res => searchInStr(res.name, search))
  }, [search, data])

  // Store ref to the filters
  // Use it to calculate when to add a class with a border
  const filtersRef = useRef<HTMLDivElement>(null)
  const { y } = useWindowPos()

  const showBorder = useMemo(() => {
    if (!filtersRef.current)
      return false

    const { bottom, height } = filtersRef.current?.getBoundingClientRect()
    return bottom + height < y
  }, [y])

  // Displays if no data are available
  if (data.length === 0) {
    return (
      <div className="no-recipe">
        <h2>
          There is
          {' '}
          <br />
          {' '}
          nothing.
        </h2>
        <p>
          Looks like nobody cooked anything up yet. You could fix that though.
          {' '}
          <Link to="/create">Add a recipe</Link>
          .
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Search, filtering, tags etc */}
      <div className={classes(['filters', { 'show-border': showBorder }])} ref={filtersRef}>
        <InputText
          value={search}
          setter={value => dispatch(setFilter(value))}
          placeholder="Search recipes"
          search
        />

        <div className="flex-1"></div>
        {/* Place remaining filters here */}
        <div className="flex-1"></div>

        {search.length > 0 && (
          <p>
            {filteredData.length}
            {' '}
            result
            {filteredData.length === 1 ? '' : 's'}
          </p>
        )}
      </div>

      <div className="recipe-list-wrap">
        { filteredData.map(item => (<RecipeItem key={item.name} data={item} />)) }
      </div>
    </>
  )
}
