import { Nullable } from './nullable'

export type NullableByProps<T, ToKeys = void> = {
  [P in keyof T]: P extends ToKeys
      ? T[P]
      : Nullable<T[P]>
}
