export function applyDefaults<O, D>(object: O, defaults: D): O & D {
  return {
    ...defaults,
    ...object
  } as O & D
}