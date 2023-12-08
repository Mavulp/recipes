import { useState } from 'react'
import type { Review } from '../../types/Review'
import { stringify } from '../../scripts/util'
import { reviews as reviewsApi } from '../../api/router'
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
        <h4 className="reviews-wrap-title">Write a review</h4>
        <div className="flex-1"></div>
        {reviews.length > 0 && (
          <span>
            {reviews.length}
            {' '}
            reviews
          </span>
        )}
      </div>

      <ReviewCreate
        onCreate={(newReview) => {
          updateList([...list, newReview])
        }}
        recipeId={recipeId}
      />

      <ul className="review-list">
        {list.map(item => (
          <ReviewItem
            key={item.id}
            data={item}
            onDelete={(reviewId: number) => {
              // Remove item
              updateList(list.filter(item => item.id !== reviewId))
              reviewsApi.delete(reviewId)
            }}
          />
        ))}
      </ul>
    </div>
  )
}
