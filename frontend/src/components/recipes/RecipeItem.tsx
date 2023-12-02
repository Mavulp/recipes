import { Link } from 'react-router-dom'
import type { RecipeMetadata } from '../../types/RecipeMetadata'

interface Props {
  data: RecipeMetadata
}

/**
 * This is a list item which is shown on homepage
 */
export function RecipeItem({ data }: Props) {
  return (
    <Link className="recipe-item" to={`/recipe/${data.id}`}>
      {data.image_url && (
        <div className="recipe-image">
          <img src={data.image_url} alt={data.name} />
        </div>
      )}

      <div className="item-info">
        <strong className="recipe-name">{data.name}</strong>
        { data.description && <p className="recipe-desc">{data.description}</p> }
      </div>
    </Link>
  )
}
