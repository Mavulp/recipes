import { useDispatch, useSelector } from 'react-redux'
import IconAdd from '../icons/IconAdd'
import type { RootState } from '../../store'
import { addEmptyStep } from '../../store/create'
import StepItem from './StepItem'

export default function StepForm() {
  const steps = useSelector((state: RootState) => state.create.steps)
  const dispatch = useDispatch()

  return (
    <>
      <ol key={steps.length}>
        { steps.map((_, index) => <StepItem key={index} index={index} />) }
      </ol>

      <button
        className="button btn-add offset btn-gray"
        onClick={() => dispatch(addEmptyStep())}
        disabled={steps.some(step => step.length === 0)}
      >
        <IconAdd />
        Add Step
      </button>
    </>
  )
}
