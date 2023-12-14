import { Link } from 'react-router-dom'
import type { RecipeMetadata } from '../../types/RecipeMetadata'
import { clampText, classes } from '../../scripts/util'
import DetailTime from '../detail/DetailTime'

interface Props {
  data: RecipeMetadata
  className?: string
}

/**
 * This is a list item which is shown on homepage
 */
export function RecipeItem({ data, className = '' }: Props) {
  return (
    <Link className={classes(['recipe-item', className])} to={`/recipe/${data.id}`}>
      {data.image_url && (
        <div className="recipe-image">
          <ul className="time-list">
            <DetailTime time={data.work_time} label="Prep" />
            <DetailTime time={data.wait_time} label="Wait" />
          </ul>

          <img src={data.image_url} alt={data.name} />
        </div>
      )}

      <div className="item-info">
        <strong className="recipe-name">{data.name}</strong>
        {data.description && <p className="recipe-desc">{clampText(36, data.description)}</p>}
      </div>
    </Link>
  )
}
