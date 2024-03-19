import { Logger } from '../modules/logger/logger'

export function BaseController<T>() {
  abstract class BaseController {
    protected static items: T[] = []

    static register(item: T) {
      Logger.trace('Controller register:', item)
      this.items.push(item)
    }

    static get(constructor: any): T {
      return this.items.find(item => item instanceof constructor)
    }
  }
  return BaseController
}
