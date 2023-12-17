import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '../loading/Spinner'
import { ingredients } from '../../api/router'
import type { Ingredient } from '../../types/Ingredient'

import IconAdd from '../icons/IconAdd'
import type { RootState } from '../../store'
import { addEmptyIngredient, selectorIsGeneralReady } from '../../store/create'
import { classes } from '../../scripts/util'
import IngredientItem from './IngredientItem'

export default function IngredientForm() {
  const data = useSelector((state: RootState) => state.create.ingredients)
  const isGeneralReady = useSelector(selectorIsGeneralReady)
  const dispatch = useDispatch()

  // On first load, fetch ingredient data
  const [loading, setLoading] = useState(true)
  const [options, setOptions] = useState<Ingredient[]>([])
  useEffect(() => {
    setLoading(true)
    ingredients.get<Ingredient[]>()
      .then((data) => {
        setOptions(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className={classes(['ingredient-form form', { 'disable-section': !isGeneralReady }])}>
      <h2>Ingredients</h2>
      {loading
        ? <Spinner text="Gathering ingredients..." />
        : (
          <>
            {data.map((item, index) => (
              <IngredientItem
                key={item.ingredient_id}
                index={index}
                options={options}
                addIngredient={setOptions}
              />
            ))}
            <button
              className="button btn-gray btn-add"
              onClick={() => dispatch(addEmptyIngredient())}
            >
              <IconAdd />
              Ingredient
            </button>
          </>
        )}
    </div>
  )
}
