import { useDispatch, useSelector } from 'react-redux'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { classes } from '../../scripts/util'
import IconPan from '../icons/IconPan'
import { clear, selectorIsGeneralReady, selectorIsIngredientReady, selectorIsStepReady } from '../../store/create'
import Spinner from '../loading/Spinner'
import type { RootState } from '../../store'
import { recipes } from '../../api/router'
import type { Recipe } from '../../types/Recipe'

export default function SubmitBar() {
  // The state object, containing the entire recipe item
  const body = useSelector((state: RootState) => state.create)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isGeneralReady = useSelector(selectorIsGeneralReady)
  const isIngredientReady = useSelector(selectorIsIngredientReady)
  const isStepReadyReady = useSelector(selectorIsStepReady)

  const allReady = useMemo(
    () => isGeneralReady && isIngredientReady && isStepReadyReady,
    [isGeneralReady, isIngredientReady, isStepReadyReady],
  )

  // Submit the recipe and route to it when it's done
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function submit() {
    if (allReady) {
      setLoading(true)
      // Can submit
      recipes.post<Recipe>({ body })
        .then((result) => {
          // When recipe is posted without issues, navigate to the new recipe detail page
          navigate(`recipe/${result.id}`)
          dispatch(clear())
        })
        .catch(e => setError(e.toString()))
        .finally(() => setLoading(false))
    }
  }

  return (
    <div className="submit-bar">
      <div className="submit-progress">
        <ul>
          <li className={classes({ complete: isGeneralReady })}>General</li>
          <li className={classes({ complete: isGeneralReady && isIngredientReady })}>Ingredients</li>
          <li className={classes({ complete: allReady })}>Cooking Steps</li>
        </ul>
      </div>

      <button
        className={classes([
          'button btn-border btn-white btn-large',
          allReady ? 'btn-black' : 'btn-white',
        ])}
        disabled={!allReady}
        onClick={submit}
      >
        {loading
          ? <Spinner light={true} />
          : (
            <>Create <IconPan /></>
          )}
      </button>

      {error && (
        <p className="submit-error">
          Error:
          {' '}
          {error}
        </p>
      )}
    </div>
  )
}
