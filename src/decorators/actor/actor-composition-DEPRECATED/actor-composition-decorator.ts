// 8a8f DEPRECATED, KEEP TO KNOW HOW TO WORK WITH METADATA

/* import 'reflect-metadata'

import { ActorInterface } from '../actor-interface'
import { ActorMetadata } from '../actor-metadata' */

/*
function ActorComposition(id: string) {
  return function (target: ActorInterface, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!Reflect.hasMetadata('metadata', target)) { // 8a8f
      Reflect.defineMetadata('metadata', new ActorMetadata(), target)
    }

    const metadata = Reflect.getMetadata('metadata', target) as ActorMetadata
  }
}
*/
