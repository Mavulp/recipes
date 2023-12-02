// interface State {

import { createSlice } from '@reduxjs/toolkit'
import type { PostRecipe } from '../types/PostRecipe'
import type { Payload } from '../scripts/type-utils'
import type { PostIngredientAssociation } from '../types/PostIngredientAssociation'

type SingleProperty = keyof Omit<PostRecipe, 'steps' | 'ingredients'>

export const recipeStore = createSlice({
  name: 'create',
  initialState: {
    steps: [''],
    ingredients: [{
      ingredient_id: 0,
      amount: null,
      amount_unit: null,
    }],
    name: '',
    description: '',
    image_url: '',
    servings: null,
    work_time: null,
    wait_time: null,
  } as PostRecipe,
  reducers: {
    setSingleProperty: (state, { payload }: Payload<{ key: SingleProperty, value: unknown }>) => {
      Object.assign(state, {
        [payload.key]: payload.value,
      })
    },
    // Appends an empty step, which will the UI reference by its iteration index
    addEmptyStep: (state) => {
      state.steps.push('')
    },
    addEmptyIngredient: (state) => {
      state.ingredients.push({
        ingredient_id: 0,
        amount: null,
        amount_unit: null,
      })
    },
    updateIngredient: (state, { payload }: Payload<{ index: number, data: PostIngredientAssociation }>) => {
      const { index, data } = payload
      const updated = state.ingredients[index]
      Object.assign(updated, data)
      state.ingredients[index] = updated
    },
    removeIngredient: (state, { payload }: Payload<{ index: number }>) => {
      state.ingredients.splice(payload.index, 1)
    },
    updateStep: (state, { payload }: Payload<{ index: number, value: string }>) => {
      state.steps[payload.index] = payload.value
    },
    removeStep: (state, { payload }: Payload<{ index: number }>) => {
      state.steps.splice(payload.index, 1)
    },
  },
})

export const {
  setSingleProperty,
  addEmptyStep,
  addEmptyIngredient,
  updateIngredient,
  removeIngredient,
  removeStep,
  updateStep,
} = recipeStore.actions
export const recipeReducer = recipeStore.reducer
