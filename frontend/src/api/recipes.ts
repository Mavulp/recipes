import { eru } from '@dolanske/eru'

export interface Recipe {
  results: Array<{
    id: number
    name: string
  }>
}

// This is an API router for recipes
export const recipes = eru('https://swapi.dev/api')
