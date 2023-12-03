import type { Recipe } from '../../types/Recipe'
import IconKeyDown from '../icons/IconKeyDown'

interface Props {
  steps: Recipe['steps']
}

export default function DetailSteps({ steps }: Props) {
  return (
    <ol className="detail-steps">
      {steps.map((step, index) => (
        <li key={step}>
          <strong>
            {index + 1}
            .
          </strong>
          <p>{step}</p>
        </li>
      ))}
    </ol>
  )
}
