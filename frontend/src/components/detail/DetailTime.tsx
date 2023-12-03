import type { Recipe } from '../../types/Recipe'
import IconClock from '../icons/IconClock'

interface Props {
  time: Recipe['work_time'] | Recipe['wait_time']
  label: string
}

function validTime(val: number | null) {
  return !!val && val > 0
}

export default function RecipeTime({ time, label }: Props) {
  return (
    <>
      {validTime(time) && (
        <li>
          <IconClock />
          <p>
            {label}
            <b>{time}</b>
            {' '}
            minutes
          </p>
        </li>
      )}
    </>
  )
}
