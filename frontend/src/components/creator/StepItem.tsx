import { useDispatch, useSelector } from 'react-redux'
import InputTextarea from '../form/InputTextarea'
import type { RootState } from '../../store'
import { removeStep, updateStep } from '../../store/create'
import IconClose from '../icons/IconClose'

interface Props {
  index: number
}

export default function StepItem({ index }: Props) {
  const value = useSelector((state: RootState) => state.create.steps[index])
  const dispatch = useDispatch()

  return (
    <li className="step-textarea">
      <InputTextarea
        value={value}
        setter={value => dispatch(updateStep({ index, value }))}
        placeholder="Describe the step..."
      />

      <buttonx
        className="btn-close btn-hover"
        data-title-top="Remove Step"
        onClick={() => dispatch(removeStep({ index }))}
      >
        <IconClose />
      </buttonx>
    </li>
  )
}
