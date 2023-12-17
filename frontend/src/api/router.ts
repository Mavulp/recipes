import { eru } from '@dolanske/eru'

const api = eru('https://recipes.hivecom.net/api')

// This is an API router for recipes
export const recipes = api.route('/recipe', {
  headers: {
    'Content-Type': 'application/json',
  },
})

export const ingredients = api.route('/ingredient', {
  headers: {
    'Content-Type': 'application/json',
  },
})
export const user = api.route('/user')
export const reviews = api.route('/review')
