import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import InputTextarea from '../form/InputTextarea'
import { recipes, reviews } from '../../api/router'
import type { Review } from '../../types/Review'
import { classes } from '../../scripts/util'
import Spinner from '../loading/Spinner'
import { sanitize } from '../../scripts/review'

const ALLOWED_LENGTH = 4096

interface Props {
  onCreate: (review: Review) => void
  recipeId: number
}

export default function ReviewCreate({ onCreate, recipeId }: Props) {
  const [text, setText] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Computed property, if true, all conditions for comment submission have been met
  const canSubmit = useMemo(() => {
    return text.length > 2 && text.length <= ALLOWED_LENGTH && !loading && !error
  }, [text, loading, error])

  function handle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!canSubmit)
      return

    setLoading(true)

    // When review is succesfully posted, call the onCreate setter
    recipes.post<Review>(`${recipeId}/review`, { body: { text: sanitize(text) } })
      .then((res) => {
        onCreate(res)
        setText('')
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setError(null)
  }, [text])

  return (
    <div className={classes(['create-review', { 'can-submit': canSubmit }])}>
      <form onSubmit={e => handle(e)}>
        <InputTextarea
          value={text}
          setter={setText}
          placeholder="What do you think of the recipe?"
        />

        <div className="submit-wrap">
          <p className="counter">
            {text.length}
            {' '}
            /
            {' '}
            {ALLOWED_LENGTH}
          </p>

          {error && (
            <p className="error-item">
              {error}
            </p>
          )}

          <div className="flex-1"></div>

          <button type="submit" className="button btn-white btn-large" disabled={!canSubmit}>
            {loading
              ? <Spinner />
              : (
                <>
                  Post
                </>
                )}
          </button>
        </div>
      </form>
    </div>
  )
}
