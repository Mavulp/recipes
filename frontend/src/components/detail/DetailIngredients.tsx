import { useMemo, useState } from 'react'
import type { Recipe } from '../../types/Recipe'
import InputCheckbox from '../form/InputCheckbox'
import { classes } from '../../scripts/util'
import IconKeyUp from '../icons/IconKeyUp'
import IconKeyDown from '../icons/IconKeyDown'

interface Props {
  ingredients: Recipe['ingredients']
  servings: Recipe['servings']
}

// TODO
// Fix types

export default function DetailIngredients({ ingredients, servings }: Props) {
  const [multiplier, setMultiplier] = useState(1)
  const [checks, setChecks] = useState<boolean[]>(
    // Initialize empty array full of false
    Array.from({ length: ingredients.length }).map(_ => false),
  )

  // Returns true, if all checks are true
  const allSelected = useMemo(() => checks.every(check => check === true), [checks])

  return (
    <div className={classes(['ingredients-wrap', { 'all-ready': allSelected }])}>
      <div className="ingredients-list">
        <h3>Ingredients</h3>

        <ul>
          {ingredients.map((item, index) => (
            <li key={item.id + item.name + index + checks[index]}>
              <InputCheckbox
                label={item.name}
                value={checks[index]}
                // God forgive me
                // Essentially to update array in state, I set the value to the items
                // Iterate over them and flip the boolean on the one that's in the current index
                setter={v => setChecks(checks.map((c, i) => index === i ? v : c))}
              />
              {/* Recipes can be without amount and servings count */}
              {item.amount && servings && (
                <span className="amount">
                  <b>{(item.amount / servings) * (servings + multiplier)}</b>
                  {' '}
                  {item.amount_unit}
                </span>
              )}
            </li>
          ))}
        </ul>

        {ingredients.length > 0 && (
          <>
            <hr />
            <InputCheckbox
              // Apologies, this for some reason doesn't correctly update
              key={String(allSelected)}
              label="I have everything ready."
              value={allSelected}
              setter={_ => setChecks(checks.map(_ => true))}
            />
          </>
        )}
      </div>

      {servings && (
        <div className="servings-count">
          <h3>Sevings</h3>
          <strong>{servings + multiplier}</strong>

          {servings && (
            <div className="buttons">
              <button className="btn-hover" data-title-right="More servings" onClick={() => setMultiplier(multiplier + 1)}>
                <IconKeyUp />
              </button>
              <button className="btn-hover" data-title-right="Less servings" onClick={() => setMultiplier(multiplier - 1)}>
                <IconKeyDown />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
