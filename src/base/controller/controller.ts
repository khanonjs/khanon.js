import { Logger } from '../../modules/logger/logger'
import { Spawnable } from '../interfaces/spawnable'

export function Controller<T>() {
  abstract class BaseController {
    static items: T[] = []

    static register(item: T) {
      BaseController.items.push(item)
    }

    /**
     * @param constructor Constructor class to find and retrieve
     * @param useInstance If 'true' use Spawnable Instance property to find the class (in case it is Spawnable), Otherwise will use the class itself for the instanceof comparison
     */
    static get<C>(constructor: C, useInstance: boolean = true): C extends any[] ? T[] : T {
      if (Array.isArray(constructor)) {
        const items = BaseController.items.filter(item => constructor.find(cnst => ((item as Spawnable<any>).Instance && useInstance) ? (item as Spawnable<any>).Instance instanceof cnst : item instanceof cnst)) as any
        if (items.length !== constructor.length) { Logger.debugError('Class from array not found on controller:', constructor) }
        return items
      } else {
        const item = BaseController.items.find(item => ((item as Spawnable<any>).Instance && useInstance) ? (item as Spawnable<any>).Instance instanceof (constructor as any) : item instanceof (constructor as any)) as any
        if (!item) { Logger.debugError('Class not found on controller:', (constructor as any).prototype) }
        return item
      }
    }
  }
  return BaseController
}
