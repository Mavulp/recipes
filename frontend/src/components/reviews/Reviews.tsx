import { useState } from 'react'
import type { Review } from '../../types/Review'
import ReviewCreate from './ReviewCreate'
import ReviewItem from './ReviewItem'

interface Props {
  reviews: Review[]
  recipeId: number
}

export default function Reviews({ reviews, recipeId }: Props) {
  // We append the data to state property, so in case a review is added
  // the review list is correctly refreshed
  const [list, updateList] = useState(reviews)
  return (
    <div className="reviews-wrap">
      <div className="flex">
        <h4 className="reviews-wrap-title">Reviews</h4>
        {reviews.length > 0 && <span>{reviews.length}</span>}
      </div>

      <ul className="review-list">
        {list.map(item => <ReviewItem key={item.id} data={item} />)}
      </ul>

      <ReviewCreate
        onCreate={(newReview) => {
          updateList((prev) => {
            prev.push(newReview)
            return prev
          })
        }}
        recipeId={recipeId}
      />
    </div>
  )
}
