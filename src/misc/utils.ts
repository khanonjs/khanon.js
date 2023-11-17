export class Utils {
  /**
   * Transform an enum to an array.
   */
  static enumToArray(e: unknown): string[] {
    return Object.keys(e)
  }

  /**
   * Returns the 'Symbol' value from an object.
   */
  static getObjectSymbolValue(object: object, symbolStr: string): unknown {
    const sym = Reflect.ownKeys(object).find(str => {
      return String(str) === `Symbol(${symbolStr})`
    })
    return object[sym]
  }

  /**
   * Return a string from any kind of object.
   * Parse errors.
   * This method avoid circular references.
   */
  static objectToString(data: unknown, stringfy = true): string {
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

  /**
   * Parse an object to another using strict schema (E.g: 'Json' to 'Oject type T').
   * Both source and target objects must have the same data model.
   * This method is used to enforce output data coincide with source model in runtime.
   * Pairs[key] = source[pairs[key]].
   */
  static parseStrictObject<T>(pairs: { [Property in keyof T]: string }, source: unknown, allowUndefined = false): T {
    const ret = {}
    Object.entries(pairs).forEach(([key]) => {
      const sourceValue = source[key as string]
      if (sourceValue === undefined && !allowUndefined) {
        throw (new Error(`Error parsing object: property ${key} doesn't exist in source data.`))
      } else {
        ret[key] = sourceValue
      }
    })
    return ret as T
  }
}
