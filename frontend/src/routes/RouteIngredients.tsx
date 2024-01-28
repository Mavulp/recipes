import { Await, defer, useLoaderData } from 'react-router-dom'
import { Suspense, useMemo, useState } from 'react'
import { ingredients } from '../api/router'
import Spinner from '../components/loading/Spinner'
import type { Ingredient } from '../types/Ingredient'
import IngredientGroup from '../components/ingredients/IngredientGroup'
import InputText from '../components/form/InputText'
import { searchInStr } from '../scripts/util'
import Button from '../components/Button'
import CreateIngredientDialog from '../components/dialogs/CreateIngredient'

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
function IngredientListManager({ data: _data }: { data: Ingredient[] }) {
  const [search, setSearch] = useState('')

  // Store prop state in case new ingredients are added
  const [data, setData] = useState(_data)

  // This give me errors because Object.prototype.groupBy is not yet supported
  // by typescript, but the only browser not having this is Safari and I can get
  // past that

  // REVIEW:
  // This will not work on safari (that's ok)
  const grouped = useMemo(() => {
    return Object.groupBy(
      data.filter(item => searchInStr(item.name, search)),
      // Group ingredients by their starting letter
      ({ name }) => name[0].toLowerCase(),
    )
  }, [data, search])

  // Adding modal for ingredients
  const [dialog, setDialog] = useState(false)

  return (
    <div className="ingredients-list">
      {dialog && (
        <CreateIngredientDialog
          onClose={() => setDialog(false)}
          addIngredient={(v) => {
            setData(v)
            setDialog(false)
          }}
        />
      )}

      <div className="filters">
        <InputText search value={search} setter={v => setSearch(v)} placeholder="Search ingredient..." className="flex-1" />

        <Button classes="button btn-gray" onClick={() => setDialog(true)}>
          New Ingredient
        </Button>
      </div>

      <ul className="list-grid">
        {Object.keys(grouped).sort().map(key => (
          <IngredientGroup key={key} letter={key} items={grouped[key]} />
        ))}
      </ul>
    </div>
  )
}
