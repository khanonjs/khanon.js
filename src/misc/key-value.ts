import { Logger } from '../modules/logger/logger'
import { Arrays } from './arrays'

abstract class KeyValueBase<K, V> {
  // TODO investigate Map class to see what's better performance
  // Investigate as well if using an object instead arrays is more efficient
  protected readonly pairs: { key: K; value: V }[] = []
  protected readonly keys: K[] = []
  protected readonly values: V[] = []

    abstract add(key: K, value: V): void
    abstract del(key: K): void
    protected abstract search<T>(keyvalue: T, arrSeach: T[]): any

    reset(): void {
      Arrays.empty(this.pairs)
      Arrays.empty(this.keys)
      Arrays.empty(this.values)
    }

    get<T = V>(key: K): T {
      return this.search<K>(key, this.keys)?.value
    }

    getPairs(): { key: K; value: V }[] {
      return this.pairs
    }

    getKeys(): K[] {
      return this.keys
    }

    getValues(): V[] {
      return this.values
    }

    getByKey(key: K): { key: K; value: V } {
      return this.search<K>(key, this.keys)
    }

    getByValue(value: V): { key: K; value: V } {
      return this.search<V>(value, this.values)
    }
}

/**
 * Non repeatable Key-Value (keys are unique in the array)
 */
export class KeyValue<K, V> extends KeyValueBase<K, V> {
  add(key: K, value: V): V {
    if (this.getByKey(key) !== undefined) {
      Logger.warn('Can\'t repeat key value -', key)
      return
    }
    this.pairs.push({ key, value })
    this.keys.push(key)
    this.values.push(value)
    return value
  }

  del(key: K): void {
    const index = this.keys.indexOf(key)
    if (index >= 0) {
      this.pairs.splice(index, 1)
      this.keys.splice(index, 1)
      this.values.splice(index, 1)
    }
  }

  protected search<T>(keyvalue: T, arrSeach: T[]): { key: K; value: V } {
    const index = arrSeach.indexOf(keyvalue)
    if (index < 0) {
      return undefined
    } else {
      return { key: this.keys[index], value: this.values[index] }
    }
  }
}

/**
 * Repeatable Key-Value (keys can be repeated in the array)
 */
export class RKeyValue<K, V> extends KeyValueBase<K, V> {
  // TODO Does it has sense a repeatable KeyValue when search only returns a single value?
  add(key: K, value: V) {
    this.pairs.push({ key, value })
    this.keys.push(key)
    this.values.push(value)
  }

  del(key: K): void {
    for (let i = this.keys.length - 1; i >= 0; i--) {
      if (this.keys[i] === key) {
        this.pairs.splice(i, 1)
        this.keys.splice(i, 1)
        this.values.splice(i, 1)
      }
    }
  }

  protected search<T>(keyvalue: T, arrSeach: T[]): { key: K; value: V }[] {
    const result = []
    for (let i = 0; i < this.keys.length; i++) {
      if (arrSeach[i] === keyvalue) {
        result.push({ key: this.keys[i], value: this.values[i] })
      }
    }
    return result
  }
}
