import { Await, Link, defer, useLoaderData } from 'react-router-dom'
import { Suspense, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { recipes } from '../api/router'
import { RecipeItem } from '../components/recipes/RecipeItem'
import InputText from '../components/form/InputText'
import type { RootState } from '../store'
import { setFilter } from '../store/filters'
import { classes, searchInStr } from '../scripts/util'
import useWindowPos from '../hooks/useWindowPos'
import InputSlider from '../components/form/InputSlider'
import type { ListRecipe } from '../types/ListRecipe'
import Spinner from '../components/loading/Spinner'

export default function RouteRecipes() {
  const { data } = useLoaderData() as { data: ListRecipe[] }
  return (
    <div className="route route-home">
      <h1 className="underline">Recipes</h1>
      <Suspense fallback={<Spinner text="Loading All Recipes" />}>
        <Await resolve={data}>
          {data => (
            <RecipeListManager data={data} />
          )}
        </Await>
      </Suspense>
    </div>
  )
}

export async function routeRecipesLoader() {
  return defer({ data: recipes.get<ListRecipe[]>() })
}

// Child component which filters on and counts amount of articles
function RecipeListManager({ data }: { data: ListRecipe[] }) {
  const search = useSelector((state: RootState) => state.filters.search)
  const dispatch = useDispatch()

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

  /////////////////////
  // Ingredient limit
  const maxIngredients = useMemo(() => {
    // Returns the number of the most ingredients in all the recipes
    const sorted = data.sort((a, b) => a.ingredient_count > b.ingredient_count ? -1 : 1)
    return sorted[0].ingredient_count
  }, [data])

  // Even if it is memoized, we only need `maxIngredients` once at the start
  const [limit, setlimit] = useState(maxIngredients)

  /////////////////////
  // Max cooking time
  const [minCookingTime, maxCookingTime] = useMemo(() => {
    const sorted = data.sort((a, b) => {
      // Recipes can be without work time, if that's the case, put them at the end by default
      if (!a.work_time || !b.work_time)
        return 1
      return a.work_time > b.work_time ? -1 : 1
    })

    // Take the longest cooking item and return its work time
    return [
      sorted.at(-1)?.work_time ?? 1,
      sorted.at(0)?.work_time ?? 1,
    ]
  }, [data])

  const [cookTime, setCookTime] = useState(maxCookingTime)

  const filteredData = useMemo(() => {
    return data.filter(res =>
      searchInStr(res.name, search) &&
      res.ingredient_count <= limit &&
      (!res.work_time || res.work_time <= cookTime)
    )
  }, [search, data, limit, cookTime])

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

        <InputSlider
          label="Max Ingredients"
          min={1}
          max={maxIngredients}
          value={limit}
          setter={val => setlimit(val)}
        />

        <InputSlider
          label="Prep Minutes"
          min={minCookingTime}
          max={maxCookingTime}
          value={cookTime}
          setter={val => setCookTime(val)}
        />

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
        {filteredData.map((item, index) => (
          <RecipeItem
            key={item.name}
            data={item}
            className={classes({
              'disable-bottom-border': (filteredData.length - index) <= (filteredData.length % 3) || filteredData.length % 3 === 0,
            })}
          />
        ))}
      </div>
    </>
  )
}
