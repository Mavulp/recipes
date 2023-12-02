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
      <ol>
        { steps.map((_, index) => <StepItem key={index} index={index} />) }
      </ol>

      <button className="button btn-white btn-add offset" onClick={() => dispatch(addEmptyStep())}>
        <IconAdd />
        Add Step
      </button>
    </>
  )
}
