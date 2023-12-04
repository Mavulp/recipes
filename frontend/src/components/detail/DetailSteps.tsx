import Markdown from 'react-markdown'
import type { Recipe } from '../../types/Recipe'

interface Props {
  steps: Recipe['steps']
}

export default function DetailSteps({ steps }: Props) {
  return (
    <ol className="detail-steps">
      {steps.map((step, index) => (
        <li key={step}>
          <strong className="counter">
            {index + 1}
            .
          </strong>
          <Markdown>{step}</Markdown>
        </li>
      ))}
    </ol>
  )
}
