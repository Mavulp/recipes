import { configureStore } from '@reduxjs/toolkit'
import { filterReducer } from './filters'
import { recipeReducer } from './create'

export const store = configureStore({
  reducer: {
    filters: filterReducer,
    create: recipeReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
