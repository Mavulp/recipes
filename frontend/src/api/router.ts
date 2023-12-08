import { eru, setupEru } from '@dolanske/eru'

setupEru({
  rootPath: 'https://recipes.hivecom.net/api',
  headers: {
    Accept: 'application/json',
  },
})

// This is an API router for recipes
export const recipes = eru('/recipe', {
  headers: {
    'Content-Type': 'application/json',
  },
})
export const ingredients = eru('/ingredient')
export const user = eru('/user')
export const reviews = eru('/review')
