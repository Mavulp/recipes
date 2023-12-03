// interface State {

import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PostRecipe } from '../types/PostRecipe'
import type { Payload } from '../scripts/type-utils'
import type { PostIngredientAssociation } from '../types/PostIngredientAssociation'
import type { RootState } from '.'

type SingleProperty = keyof Omit<PostRecipe, 'steps' | 'ingredients'>

const emptyState: PostRecipe = {
  steps: [''],
  ingredients: [{
    ingredient_id: -1,
    amount: null,
    amount_unit: null,
  }],
  name: '',
  description: '',
  image_url: '',
  servings: null,
  work_time: null,
  wait_time: null,
}

export const recipeStore = createSlice({
  name: 'create',
  initialState: structuredClone(emptyState) as PostRecipe,
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
    clear: (state) => {
      // Reset state when recipe is successfuly added
      Object.assign(state, emptyState)
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
  clear,
} = recipeStore.actions
export const recipeReducer = recipeStore.reducer

// Custom memoized selectors

// This selector returns true, if all required fields in the "general" section are ready
export const selectorIsGeneralReady = createSelector(
  // Only name is required for a recipe to be valid
  [(state: RootState) => state.create.name],
  name => !!name && name.length > 0,
)

// This selector returns true, if all ingredients are valid
export const selectorIsIngredientReady = createSelector(
  [(state: RootState) => state.create.ingredients],
  ingredients => ingredients.every(item => item.ingredient_id > -1),
)

// Returns true, if all steps are valid
export const selectorIsStepReady = createSelector(
  [(state: RootState) => state.create.steps],
  steps => steps.every(step => step.length > 0),
)
