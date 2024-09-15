import { Metadata } from '../../base/interfaces/metadata/metadata'
import { Logger } from '../../modules/logger'
import { ActorInterface } from '../actor/actor-interface'
import { ActorStateInterface } from '../actor/actor-state/actor-state-interface'
import { AppInterface } from '../app/app-interface'
import { AppStateInterface } from '../app/app-state/app-state-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SceneStateInterface } from '../scene/scene-state/scene-state-interface'
import { NotificationProps } from './notification-props'

export function Notification(props: NotificationProps): any {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.prototype && (
      target instanceof AppInterface ||
      target instanceof AppStateInterface ||
      target instanceof ActorInterface ||
      target instanceof ActorStateInterface ||
      target instanceof SceneInterface ||
      target instanceof SceneStateInterface ||
      target instanceof ParticleInterface
    ) && descriptor) { // Defined descriptor means it is a decorated method
      if (!Reflect.hasMetadata('metadata', target)) {
        Reflect.defineMetadata('metadata', new Metadata(), target)
      }
      const metadata = Reflect.getMetadata('metadata', target) as Metadata
      if (metadata.notifiers.get(props.message)) { Logger.debugError(`Trying to define duplicated Notification message '${props.message}' to element '${target.constructor.name}'.`); return }
      metadata.notifiers.set(props.message, {
        props,
        methodName: propertyKey
      })
    } else {
      Logger.debugError(`Cannot apply Notification decorator to non allowed method '${propertyKey}' in class '${target.constructor.name}'.`)
    }
  }
}
