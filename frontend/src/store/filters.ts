// Redux store which holds filter data

import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface State {
  search: string
  activeTags: string[]
}

export const filterStore = createSlice({
  name: 'filters',
  initialState: {
    search: '',
    activeTags: [],
  } as State,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setTag: (state, action: PayloadAction<string>) => {
      if (state.activeTags.includes(action.payload))
        state.activeTags = state.activeTags.filter(tag => tag === action.payload)
      else
        state.activeTags.push(action.payload)
    },
  },
})

export const { setFilter } = filterStore.actions
export const filterReducer = filterStore.reducer
