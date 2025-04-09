import { Metadata } from '../../base/interfaces/metadata/metadata'
import { MetadataInputEventDefinition } from '../../base/interfaces/metadata/metadata-input-event-definition'
import { Logger } from '../../modules/logger'
import { objectToString } from '../../utils/utils'
import { ActorInterface } from '../actor/actor-interface'
import { ActorStateInterface } from '../actor/actor-state/actor-state-interface'
import { AppStateInterface } from '../app/app-state/app-state-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SceneStateInterface } from '../scene/scene-state/scene-state-interface'
import { InputEventData } from './input-event-data'
import { InputEventProps } from './input-event-props'

export function InputEvent(props: InputEventProps): any {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.prototype && (
      target instanceof AppStateInterface ||
      target instanceof ActorInterface ||
      target instanceof ActorStateInterface ||
      target instanceof SceneInterface ||
      target instanceof SceneStateInterface
    ) && descriptor) { // Defined descriptor means it is a decorated method
      if (!Reflect.hasMetadata('metadata', target)) {
        Reflect.defineMetadata('metadata', new Metadata(), target)
      }
      const metadata = Reflect.getMetadata('metadata', target) as Metadata
      let inputEventById: Map<InputEventData, MetadataInputEventDefinition> | undefined
      inputEventById = metadata.inputEvents.get(props.id)
      if (inputEventById) {
        if (inputEventById.get(props.data)) { Logger.debugError(`Trying to define duplicated Input Event, Id: '${props.id}', data: '${objectToString(props.data)}' in element '${target.constructor.name}'.`); return }
      } else {
        inputEventById = new Map<InputEventData, MetadataInputEventDefinition>()
      }
      inputEventById.set(props.data, {
        props,
        methodName: propertyKey
      })
      metadata.inputEvents.set(props.id, inputEventById)
    } else {
      Logger.debugError(`Cannot apply Input Event decorator to non allowed method '${propertyKey}' in class '${target.constructor.name}'.`)
    }
  }
}
