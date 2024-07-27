import 'reflect-metadata'

import { Logger } from '../../modules/logger'
import { ActorInterface } from '../actor/actor-interface'
import { ActorMetadata } from '../actor/actor-metadata'
import { ActorStateInterface } from '../actor/actor-state/actor-state-interface'
import { AppInterface } from '../app/app-interface'
import { AppMetadata } from '../app/app-metadata'
import { SceneInterface } from '../scene/scene-interface'
import { SceneMetadata } from '../scene/scene-metadata'
import { SceneStateInterface } from '../scene/scene-state/scene-state-interface'
import { NotificationProps } from './notification-props'

export function Notification(props: NotificationProps): any {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.prototype && (
      target instanceof AppInterface ||
      target instanceof ActorInterface ||
      target instanceof ActorStateInterface ||
      target instanceof SceneInterface ||
      target instanceof SceneStateInterface
    ) && descriptor) { // Defined descriptor means it is a decorated method
      if (!Reflect.hasMetadata('metadata', target)) {
        let metadata: AppMetadata | ActorMetadata | SceneMetadata
        if (target instanceof AppInterface) {
          metadata = new AppMetadata()
        } else if (target instanceof ActorInterface ||
          target instanceof ActorStateInterface) {
          metadata = new ActorMetadata()
        } else {
          metadata = new SceneMetadata()
        }
        Reflect.defineMetadata('metadata', metadata, target)
      }
      const metadata = Reflect.getMetadata('metadata', target) as (AppMetadata | ActorMetadata | SceneMetadata)
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
