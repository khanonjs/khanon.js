import 'reflect-metadata' // 8a8f usar reflect-metadata/lite

import { ActorCompositionsController } from '../../../controllers/actor-compositions-controller'
import { Logger } from '../../../modules'
import { ActorInterface } from '../actor-interface'
import { ActorMetadata } from '../actor-metadata'

export function ActorComposition(id: string) {
  Logger.trace('aki EVALUATE ActorComposition')
  return function (target: ActorInterface, propertyKey: string, descriptor: PropertyDescriptor) {
    Logger.trace('aki ACTOR COMPOSITION DECORATOR target A', target)
    // Logger.trace('aki ACTOR COMPOSITION DECORATOR propertyKey', target.compositions)
    Logger.trace('aki ACTOR COMPOSITION DECORATOR descriptor', descriptor)

    // Reflect.defineMetadata('propKey', 'propValue', target)

    if (!Reflect.getMetadata('metadata', target)) {
      Reflect.defineMetadata('metadata', new ActorMetadata(), target)
    }

    const metadata = Reflect.getMetadata('metadata', target) as ActorMetadata
    metadata.compositions.set(id, target[propertyKey])
    // target['hola'].set(id, target[propertyKey])
    Logger.trace('aki ACTOR COMPOSITION DECORATOR target B', target)
    // ActorCompositionsController.set(target, id, target[propertyKey])
    // setTimeout(() => target.setComposition(), 1)
    // target.compositions.set(id, target[propertyKey])
  }
}
