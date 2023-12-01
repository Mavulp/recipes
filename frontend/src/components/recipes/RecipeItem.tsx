import { Link } from 'react-router-dom'
import type { Recipe } from '../../api/recipes'

interface Props {
  data: Recipe['results'][number]
}

/**
 * This is a list item which is shown on homepage
 */
export function RecipeItem({ data }: Props) {
  // TODO, testing api doesnt contain id
  data.id = 1

  return (
    <Link className="recipe-item" to={`/recipe/${data.id}`}>
      <strong className="recipe-name">{data.name}</strong>
    </Link>
  )
}
