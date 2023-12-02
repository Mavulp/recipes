import type { LoaderFunction } from 'react-router-dom'

export type LoaderData<TLoaderFn extends LoaderFunction> = Awaited<ReturnType<TLoaderFn>> extends Response | infer D
  ? D
  : never

export type ValueOf<T> = T[keyof T]

// Shorthand for typing reducers
export interface Payload<T> { payload: T }
