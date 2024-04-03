import { ExtractOptional } from '../types/extract-optional'

/**
 * Invokes optional callback
 */
export function invokeCallback(func?: () => void, context?: any, ...params: any[]) {
  if (func !== undefined) {
    func.bind(context).call(params)
  }
}

/**
 * Applies default configuration to the not setted properties of an object
 */
export function applyDefaults<O, D extends ExtractOptional<O>>(object: O, defaults: D): O & D {
  return {
    ...defaults,
    ...object
  }
}

/**
 * Returns a string from any kind of object.
 * Parse errors.
 * This method prevents circular references.
 */
export function objectToString(data: unknown, stringfy = true): string {
  function getCircularReplacer() {
    const ancestors = []
    return function (key, value) {
      if (typeof value !== 'object' || value === null) {
        return value
      }
      // `this` is the object that value is contained in,
      // i.e., its direct parent.
      // @ts-ignore
      while (ancestors.length > 0 && ancestors.at(-1) !== this) {
        ancestors.pop()
      }
      if (ancestors.includes(value)) {
        return '[Circular]'
      }
      ancestors.push(value)
      return value
    }
  }
  return data
    ? (data instanceof Error
      ? data.message
      : (typeof data === 'object' && stringfy
        ? JSON.stringify(data, getCircularReplacer())
        : data as string))
    : ''
}
