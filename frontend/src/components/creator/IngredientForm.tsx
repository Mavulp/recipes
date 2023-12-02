import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '../loading/Spinner'
import { ingredients } from '../../api/recipes'
import type { Ingredient } from '../../types/Ingredient'

import IconAdd from '../icons/IconAdd'
import type { RootState } from '../../store'
import { addEmptyIngredient } from '../../store/create'
import IngredientItem from './IngredientItem'

export default function IngredientForm() {
  const data = useSelector((state: RootState) => state.create.ingredients)
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
        // dispatch(addEmptyIngredient())
      })
  }, [])

  return (
    <div className="ingredient-form form">
      { loading
        ? <Spinner text="Gathering ingredients..." />
        : (
          <>
            <div>

              {
              options.length > 0
                ? data.map((_, index) => (<IngredientItem key={index} index={index} options={options} />))
                : <p>TODO No ingredients available. You can add one here.</p>
            }
            </div>

            <button
              className="button btn-white btn-add"
              onClick={() => dispatch(addEmptyIngredient())}
            >
              <IconAdd />
              Add Ingredient
            </button>
          </>
          )}
    </div>
  )
}
