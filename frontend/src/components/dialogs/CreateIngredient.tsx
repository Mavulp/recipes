import { useState } from 'react'
import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { Fn } from '@vueuse/core'
import Dialog from '../Dialog'
import InputText from '../form/InputText'
import InputTextarea from '../form/InputTextarea'
import Button from '../Button'
import IconAdd from '../icons/IconAdd'
import { ingredients } from '../../api/router'
import type { Ingredient } from '../../types/Ingredient'

interface Props {
  addIngredient: Dispatch<SetStateAction<Ingredient[]>>
  onClose: Fn
}

// REVIEW
// Make sure we figure out if front-end or backend should be checking for duplicate ingredients
export default function CreateIngredientDialog({ onClose, addIngredient }: Props) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<Error>()

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr(undefined)

    const form = new FormData((e.target as HTMLFormElement))
    const body = Object.fromEntries(form) as {
      name: string
      description: string
    }

    if (body.name.length <= 1 || body.description.length <= 1) {
      setErr(new Error('Ingredient name and description are both required.'))
      return
    }

    setLoading(true)

    ingredients.post<Ingredient>(body)
      .then((item) => {
        addIngredient((v) => {
          return [
            ...v,
            item,
          ]
        })
      })
      .catch(setErr)
      .finally(() => setLoading(false))
  }

  return (
    <Dialog onClose={onClose}>
      <div className="create-ingredient">
        <h3>New Ingredient</h3>

        <form onSubmit={submit}>
          <InputText name="name" className="has-border" label="Name" placeholder="Ingredient name..." />
          <InputTextarea name="description" label="Description" placeholder="Ingredient description..." />

          {err && <p className="error-text">{err.message}</p>}

          <Button loading={loading} classes="button btn-gray w-100" type="submit">
            <IconAdd />
            Create
          </Button>
        </form>

      </div>
    </Dialog>
  )
}
