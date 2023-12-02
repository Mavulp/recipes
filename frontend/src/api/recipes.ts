import { eru, setupEru } from '@dolanske/eru'
import type { Ingredient } from '../types/Ingredient'

setupEru({
  rootPath: 'https://recipes.hivecom.net/api',
  headers: {
    Accept: 'application/json',
  },
})

// This is an API router for recipes
export const recipes = eru('/recipe')
export const ingredients = eru('/ingredient')
export const user = eru('/user')
