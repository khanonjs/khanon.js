import 'reflect-metadata'

import { Logger } from '../../modules/logger'
import { ActorInterface } from '../actor/actor-interface'
import { ActorMetadata } from '../actor/actor-metadata'
import { SceneInterface } from '../scene/scene-interface'
import { SceneMetadata } from '../scene/scene-metadata'
import { NotificationProps } from './notification-props'

export function Notification(props: NotificationProps = {}): any {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.prototype && (
      target instanceof ActorInterface ||
      target instanceof SceneInterface
    ) && descriptor) { // Defined descriptor means it is a decorated method
      if (!Reflect.hasMetadata('metadata', target)) {
        Reflect.defineMetadata('metadata', target instanceof ActorInterface ? new ActorMetadata() : new SceneMetadata(), target)
      }
      const metadata = Reflect.getMetadata('metadata', target) as (ActorMetadata | SceneMetadata)
      // metadata.meshes.push({
      //   propertyName: contextOrProperty as string,
      //   classDefinition: _meshInterface
      // })
    } else {
      Logger.debugError('Cannot apply Notify decorator to non allowed method class:', target, propertyKey)
    }
  }
}
