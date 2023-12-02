import type { FormEvent } from 'react'
import IngredientForm from '../components/creator/IngredientForm'
import StepForm from '../components/creator/StepForm'
import BasicForm from '../components/creator/BasicForm'
import SubmitBar from '../components/creator/SubmitBar'

export default function RouteCreate() {
  // function handleSubmit(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault()
  //   // Simply call an action and it'll do the stuff
  // }

  return (
    <div className="route route-create">
      <h1 className="underline">Create</h1>
      <div className="grid col-2 gap-64">
        <div>
          <h2>The Basics</h2>
          <BasicForm />

          <h2>Ingredients</h2>
          <IngredientForm />

          <h2>Steps</h2>
          <p>Describe the steps which are required to make the meal.</p>
          <StepForm />
        </div>

        <div>
          <SubmitBar />
        </div>
      </div>
    </div>
  )
}
