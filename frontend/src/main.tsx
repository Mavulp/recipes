import React from 'react'
import ReactDOM from 'react-dom/client'
import './style/index.scss'
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import RouteHome, { routeHomeLoader } from './routes/RouteHome.tsx'
import { RouteError } from './routes/RouteError.tsx'
import RouteRecipe, { routeRecipeLoader } from './routes/RouteRecipe.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RouteHome />,
    loader: routeHomeLoader,
    errorElement: <RouteError />,
  },
  {
    path: '/recipe/:recipeId',
    element: <RouteRecipe />,
    loader: routeRecipeLoader,
    errorElement: <RouteError />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="container">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>,
)
