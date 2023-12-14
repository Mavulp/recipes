import { formatDate, stringify } from '../../scripts/util'
import type { Ingredient } from '../../types/Ingredient'
import Details from '../Details'
import IconKeyDown from '../icons/IconKeyDown'

interface Props {
  letter: string
  items: Ingredient[]
}

export default function IngredientGroup({ letter, items }: Props) {
  return (
    <li>
      <div>
        <strong className="letter-title">{letter}</strong>
      </div>
      <div className="letter-items-wrap">
        {items.map(item => (
          <Details
            key={item.id}
            header={(
              <>
                <span>{item.name}</span>
                <IconKeyDown />
              </>
            )}
          >
            <div className="ingredient-data">
              <p>{item.description}</p>
              <div>
                <span>
                  Added by
                  {' '}
                  <b>{item.author}</b>
                </span>
                <span>
                  At
                  {' '}
                  <b>{formatDate(item.created_at)}</b>
                </span>
              </div>
            </div>
          </Details>
        ))}
      </div>
    </li>
  )
}
