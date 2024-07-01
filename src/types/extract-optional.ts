type OptionalPropertyOf<T> = Exclude<{
  [K in keyof T]: T extends Record<K, T[K]>
    ? never
    : K
}[keyof T], undefined>

export type ExtractOptional<T> = Pick<T, Exclude<OptionalPropertyOf<T>, undefined>>
