import 'reflect-metadata'

import { Logger } from '../../modules/logger'
import { ActorInterface } from '../actor/actor-interface'
import { ActorMetadata } from '../actor/actor-metadata'
import { NotificationProps } from './notification-props'

export function Notification(props: NotificationProps): any {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.prototype && (
      target instanceof ActorInterface
    ) && descriptor) { // Defined descriptor means it is a decorated method
      if (!Reflect.hasMetadata('metadata', target)) {
        Reflect.defineMetadata('metadata', new ActorMetadata(), target)
      }
      const metadata = Reflect.getMetadata('metadata', target) as (ActorMetadata)
      if (metadata.notifiers.get(props.message)) { Logger.debugError(`Trying to define duplicated Notification message '${props.message}' to element '${target.constructor.name}'.`); return }
      metadata.notifiers.set(props.message, {
        props,
        methodName: propertyKey
      })
    } else {
      Logger.debugError(`Cannot apply Notification decorator to non allowed method '${propertyKey}' in element '${target.constructor.name}'.`)
    }
  }
}
