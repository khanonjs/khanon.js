import { Metadata } from '../../base/interfaces/metadata/metadata'
import { Logger } from '../../modules/logger'
import { ActorInterface } from '../actor/actor-interface'
import { ActorStateInterface } from '../actor/actor-state/actor-state-interface'
import { CameraInterface } from '../camera/camera-interface'
import { CameraStateInterface } from '../camera/camera-state/camera-state-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SceneStateInterface } from '../scene/scene-state/scene-state-interface'
import { InputEventProps } from './input-event-props'

export function InputEvent(props: InputEventProps): any {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.prototype && (
      target instanceof ActorInterface ||
      target instanceof ActorStateInterface ||
      target instanceof SceneInterface ||
      target instanceof SceneStateInterface ||
      target instanceof CameraInterface ||
      target instanceof CameraStateInterface
    ) && descriptor) { // Defined descriptor means it is a decorated method
      if (!Reflect.hasMetadata('metadata', target)) {
        Reflect.defineMetadata('metadata', new Metadata(), target)
      }
      const metadata = Reflect.getMetadata('metadata', target) as Metadata
      if (metadata.inputEvents.get(props.id)) { Logger.debugError(`Trying to define duplicated Input Event Ids '${props.id}' to element '${target.constructor.name}'.`); return }
      metadata.inputEvents.set(props.id, {
        props,
        methodName: propertyKey
      })
    } else {
      Logger.debugError(`Cannot apply Input Event decorator to non allowed method '${propertyKey}' in class '${target.constructor.name}'.`)
    }
  }
}
