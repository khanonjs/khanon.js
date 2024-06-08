import { Logger } from '../../modules/logger/logger'
import { Spawnable } from '../interfaces/spawnable'

export function Controller<T>() {
  abstract class BaseController {
    protected static items: T[] = []

    static register(item: T) {
      Logger.trace('Controller register:', item)
      BaseController.items.push(item)
    }

    static get<C>(constructor: C): C extends any[] ? T[] : T {
      if (Array.isArray(constructor)) {
        const items = BaseController.items.filter(item => constructor.find(cnst => (item as Spawnable<any>).Instance ? (item as Spawnable<any>).Instance instanceof cnst : item instanceof cnst)) as any
        if (items.length !== constructor.length) { Logger.debugError('Class from array not found on controller:', constructor) }
        return items
      } else {
        const item = BaseController.items.find(item => ((item as Spawnable<any>).Instance) ? (item as Spawnable<any>).Instance instanceof (constructor as any) : item instanceof (constructor as any)) as any
        if (!item) { Logger.debugError('Class not found on controller:', (constructor as any).prototype) }
        return item
      }
    }
  }
  return BaseController
}
