import {
  MetadataActionDefinition,
  MetadataMeshDefinition,
  MetadataNotifierDefinition,
  MetadataSpriteDefinition
} from '../../base'
import { ActorActionConstructor } from '../../constructors/actor-action-constructor'
import { FlexId } from '../../types'
import { ActorProps } from './actor-props'

export class ActorMetadata {
  actions: MetadataActionDefinition<ActorActionConstructor>[] = []
  sprites: MetadataSpriteDefinition[] = []
  meshes: MetadataMeshDefinition[] = []
  notifiers: Map<FlexId, MetadataNotifierDefinition> = new Map<FlexId, MetadataNotifierDefinition>()

  applyProps(_class: any): void {
    this.actions.forEach(definition => {
      _class[definition.methodName] = definition.classDefinition
    })
    this.sprites.forEach(definition => {
      _class[definition.propertyName] = definition.classDefinition
    })
    this.meshes.forEach(definition => {
      _class[definition.propertyName] = definition.classDefinition
    })
  }

  /**
   * Returns the equivalent to the decorator props, that have been added through decorators
   */
  getProps(): ActorProps {
    return {
      actions: this.actions.map(definition => definition.classDefinition),
      sprites: this.sprites.map(definition => definition.classDefinition),
      meshes: this.meshes.map(definition => definition.classDefinition)
    }
  }
}
