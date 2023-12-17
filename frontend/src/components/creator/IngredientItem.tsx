import { useDispatch, useSelector } from 'react-redux'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo, useState } from 'react'
import type { RootState } from '../../store'
import InputText from '../form/InputText'
import SingleSelect from '../form/SingleSelect'
import type { Ingredient } from '../../types/Ingredient'
import { searchInStr } from '../../scripts/util'
import type { PostIngredientAssociation } from '../../types/PostIngredientAssociation'
import { removeIngredient, updateIngredient } from '../../store/create'
import IconClose from '../icons/IconClose'
import CreateIngredientDialog from '../dialogs/CreateIngredient'

interface Props {
  // Stores the index of the ingredient inside the redux store for ingredients
  index: number
  options: Ingredient[]
  addIngredient: Dispatch<SetStateAction<Ingredient[]>>
}

export default function IngredientItem({ index, options, addIngredient }: Props) {
  const form = useSelector((state: RootState) => state.create.ingredients[index])
  const dispatch = useDispatch()

  const ingredientName = useMemo(() => {
    return options.find(item => item.id === form.ingredient_id)?.name ?? null
  }, [options, form])

  // Filter options based on search
  const [search, setSearch] = useState<string>('')
  const filterOptions = useMemo(() => {
    if (!search && search.length === 0)
      return options
    return options.filter(option => searchInStr(option.name, search))
  }, [search, options])

  const update = useCallback((key: keyof PostIngredientAssociation, value: unknown) => {
    const data = Object.assign({}, form, {
      [key]: value,
    })

    dispatch(updateIngredient({ index, data }))
  }, [form, dispatch, index])

  const formatOptions = useMemo(() => {
    return filterOptions.reduce((group, item) => {
      group[item.name] = () => {
        update('ingredient_id', item.id)
        setSearch('')
      }

      return group
    }, {} as Record<string, () => void>)
  }, [filterOptions, update])

  // Dialog stuff for creating a new ingredient
  const [dialog, setDialog] = useState(false)

  return (
    <>
      {dialog && <CreateIngredientDialog onClose={() => setDialog(false)} addIngredient={addIngredient} />}

      <div className="ingredient-item">
        <SingleSelect
          label="Ingredient"
          options={formatOptions}
          selected={ingredientName}
          noResults={<button className="button btn-white" onClick={() => setDialog(true)}>Create Ingredient</button>}
        />

        <InputText
          value={form.amount}
          setter={value => update('amount', Number(value))}
          placeholder="Ingredient amount"
          label="Amount"
        />

        <InputText
          value={form.amount_unit}
          setter={value => update('amount_unit', value)}
          placeholder="kg, ml, l, ton..."
          label="Unit"
        />

        <button
          className="btn-close btn-hover"
          data-title-top="Remove Ingredient"
          onClick={() => dispatch(removeIngredient({ index }))}
        >
          <IconClose />
        </button>
      </div>
    </>
  )
}
