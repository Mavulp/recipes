import { Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import { formatDate } from '../../scripts/util'
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
        {/* Profile picture */}
        {/* {data.user.image_url && (
          <div className="image-wrap">
            <img src="" alt="" />
          </div>
        )} */}
        <Link to={`user/${data.id}`}>{data.author}</Link>
        <span>{formatDate(data.created_at)}</span>
      </div>
      <Markdown>{formatCommentContent(data.text)}</Markdown>
    </li>
  )
}
