import { Link } from 'react-router-dom'
import { formatDate, randomLightColor } from '../../scripts/util'
import type { Review } from '../../types/Review'
import { formatCommentContent } from '../../scripts/review'
import Button from '../Button'
import IconClose from '../icons/IconClose'

interface Props {
  data: Review
  onDelete: (reviewId: number) => void
}

export default function ReviewItem({ data, onDelete }: Props) {
  return (
    <li className="review-item">
      {/* Only show if the logged in user is the one who posted it  */}
      <Button classes="btn-hover btn-icon" data-title-top="Remove Review" onClick={() => onDelete(data.id)}>
        <IconClose />
      </Button>

      <div className="review-header">
        <div className="image-wrap" style={{ backgroundColor: randomLightColor() }}>
          <strong>{data.author[0]}</strong>
        </div>
        <Link to={`user/${data.id}`}>{data.author}</Link>
        <div className="flex-1"></div>
        <span>{formatDate(data.created_at)}</span>
      </div>
      <p className="review-content" dangerouslySetInnerHTML={{ __html: formatCommentContent(data.text) }} />
    </li>
  )
}
