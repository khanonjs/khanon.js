import 'reflect-metadata'

// 8a8f hacer esto tras del uso de Sprite independiente del actor
import { ActorInterface } from '../actor-interface'
import { ActorMetadata } from '../actor-metadata'

// 8a8f property decorator
export function ActorSprite(id: string) {
  return function (target: ActorInterface, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!Reflect.hasMetadata('metadata', target)) { // 8a8f
      Reflect.defineMetadata('metadata', new ActorMetadata(), target)
    }
  }
}
