import IngredientForm from '../components/creator/IngredientForm'
import StepForm from '../components/creator/StepForm'
import BasicForm from '../components/creator/BasicForm'
import SubmitBar from '../components/creator/SubmitBar'

export default function RouteCreate() {
  return (
    <div className="route route-create">
      <h1 className="underline">New recipe</h1>

      <SubmitBar />

      <div className="wrapper">
        <h2>General Informaion</h2>
        <BasicForm />

        <h2>Ingredients</h2>
        <IngredientForm />

        <h2>Steps</h2>
        <p>Describe the steps which are required to make the meal. It is recommended to use simple language and not provide unrelated information.</p>
        <StepForm />
      </div>
    </div>
  )
}
