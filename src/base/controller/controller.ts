import { Logger } from '../../modules/logger/logger'

export function Controller<T>() {
  abstract class BaseController {
    protected static items: T[] = []

    static register(item: T) {
      Logger.trace('Controller register:', item)
      BaseController.items.push(item)
    }

    static get<C>(constructor: C): C extends any[] ? T[] : T {
      if (Array.isArray(constructor)) {
        return BaseController.items.filter(item => constructor.find(cnst => item instanceof cnst)) as any
      } else {
        return BaseController.items.find(item => item instanceof (constructor as any)) as any
      }
    }
  }
  return BaseController
}
