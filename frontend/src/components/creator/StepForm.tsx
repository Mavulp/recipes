import { useDispatch, useSelector } from 'react-redux'
import IconAdd from '../icons/IconAdd'
import type { RootState } from '../../store'
import { addEmptyStep, selectorIsIngredientReady } from '../../store/create'
import { classes } from '../../scripts/util'
import StepItem from './StepItem'

export default function StepForm() {
  const dispatch = useDispatch()
  const steps = useSelector((state: RootState) => state.create.steps)
  const isStepReady = useSelector(selectorIsIngredientReady)

  return (
    <div className={classes({ 'disable-section': !isStepReady })}>
      <h2>Steps</h2>
      <p>Describe the steps which are required to make the meal. It is recommended to use simple language and not provide unrelated information.</p>

      <ol key={steps.length}>
        {steps.map((_, index) => <StepItem key={index} index={index} />)}
      </ol>

      <button
        className="button btn-add offset btn-gray"
        onClick={() => dispatch(addEmptyStep())}
        disabled={steps.some(step => step.length === 0)}
      >
        <IconAdd />
        Step
      </button>
    </div>
  )
}
