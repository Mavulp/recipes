import { Link } from 'react-router-dom'
import { formatDate, randomLightColor } from '../../scripts/util'
import type { Review } from '../../types/Review'
import { formatCommentContent } from '../../scripts/review'

interface Props {
  data: Review
}

// https://github.com/remarkjs/react-markdown#use-custom-components-syntax-highlight
export default function ReviewItem({ data }: Props) {
  return (
    <li className="review-item">
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
