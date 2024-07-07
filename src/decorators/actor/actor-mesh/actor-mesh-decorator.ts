import 'reflect-metadata'

import { ActorInterface } from '../actor-interface'
import { ActorMetadata } from '../actor-metadata'

export function ActorMesh(id: string) {
  return function (target: ActorInterface, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!Reflect.hasMetadata('metadata', target)) {
      Reflect.defineMetadata('metadata', new ActorMetadata(), target)
    }
  }
}
