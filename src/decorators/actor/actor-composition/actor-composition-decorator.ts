import { ActorCompositionsController } from '../../../controllers/actor-compositions-controller'
import { Logger } from '../../../modules'
import { ActorInterface } from '../actor-interface'

export function ActorComposition(id: string) {
  Logger.trace('aki EVAALUATE ActorComposition')
  return function (target: ActorInterface, propertyKey: string, descriptor: PropertyDescriptor) {
    Logger.trace('aki ACTOR COMPOSITION DECORATOR target', target)
    Logger.trace('aki ACTOR COMPOSITION DECORATOR propertyKey', propertyKey)
    Logger.trace('aki ACTOR COMPOSITION DECORATOR descriptor', descriptor)

    if (!target.compositions) {
      target.compositions = new Map<string, () => any>()
    }
    ActorCompositionsController.set(target, id, target[propertyKey])
    // target.compositions.set(id, target[propertyKey])
  }
}
