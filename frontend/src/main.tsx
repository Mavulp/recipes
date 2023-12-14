import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './style/index.scss'
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { Provider } from 'react-redux'
import RouteRecipes, { routeRecipesLoader } from './routes/RouteRecipes.tsx'
import RouteError from './routes/RouteError.tsx'
import RouteRecipe, { routeRecipeLoader } from './routes/RouteRecipe.tsx'
import { Navigation } from './components/navigation/Navigation.tsx'
import RouteCreate from './routes/RouteCreate.tsx'
import { store } from './store/index.ts'
import RouteUser, { routeUserLoader } from './routes/RouteUser.tsx'
import Footer from './components/navigation/Footer.tsx'
import RouteIngredients, { routeIngredientsLoader } from './routes/RouteIngredients.tsx'

// Root wrapper around the router views
// Anything that should be persistent between routes,
// should be placed above or bellow the <Outlet /> component
function App() {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (location.pathname === '/')
      navigate('/recipes')
  })
  return (
    <>
      <Navigation />
      <div className="container">
        <Outlet />
        <Footer />
      </div>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteError />,
    children: [
      {
        path: 'recipes',
        element: <RouteRecipes />,
        loader: routeRecipesLoader,
      },
      {
        path: 'recipe/:recipeId',
        element: <RouteRecipe />,
        loader: routeRecipeLoader,
      },
      {
        path: 'create',
        element: <RouteCreate />,
      },
      {
        path: 'user/:userId',
        element: <RouteUser />,
        loader: routeUserLoader,
      },
      {
        path: 'ingredients',
        element: <RouteIngredients />,
        loader: routeIngredientsLoader,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider
        router={router}
        fallbackElement={<RouteError />}
      />
    </Provider>
  </React.StrictMode>,
)
