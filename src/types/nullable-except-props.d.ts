import { Nullable } from './nullable'

export type NullableExceptProps<T, ToKeys = void> = {
  [P in keyof T]: P extends ToKeys
      ? Nullable<T[P]>
      : T[P]
}
