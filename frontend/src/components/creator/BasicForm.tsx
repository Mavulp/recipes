import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../store'
import InputText from '../form/InputText'
import InputTextarea from '../form/InputTextarea'
import { setSingleProperty } from '../../store/create'
import type { PostRecipe } from '../../types/PostRecipe'

// Define UI elements in JS to simplify template
type FormInputs = Array<{ label: string, key: keyof Omit<PostRecipe, 'steps' | 'ingredients'>, placeholder: string }>
const NumberInputs: FormInputs = [
  { label: 'Servings', key: 'servings', placeholder: 'Amount of servings...' },
  { label: 'Waiting time', key: 'wait_time', placeholder: 'Enter amount of minutes...' },
  { label: 'Preparation time', key: 'work_time', placeholder: 'Enter amount of minutes...' },
]

export default function BasicForm() {
  const form = useSelector((state: RootState) => state.create)
  const dispatch = useDispatch()

  return (
    <>
      <div className="form">
        <InputText
          value={form.name}
          setter={value => dispatch(setSingleProperty({ key: 'name', value }))}
          placeholder="What are we cooking?"
          label="Title"
        />

        <InputTextarea
          value={form.description}
          setter={value => dispatch(setSingleProperty({ key: 'description', value }))}
          placeholder="Describe the recipe. You can use markdown too"
          label="Description"
        />

        <div className="image-preview">
          <InputText
            value={form.image_url}
            setter={value => dispatch(setSingleProperty({ key: 'image_url', value }))}
            placeholder="Add a thumbnail to the recipe"
            label="Cover photo (optional)"
          />

          {form.image_url && (
            <div className="preview">
              <img src={form.image_url} alt="" />
            </div>
          )}
        </div>

        <div className="small-info">
          { NumberInputs.map(i => (
            <InputText
              key={i.key}
              value={form[i.key]}
              setter={value => dispatch(setSingleProperty({ key: i.key, value: Number(value) }))}
              placeholder={i.placeholder}
              label={i.label}
            />
          ))}
        </div>
      </div>
    </>
  )
}
