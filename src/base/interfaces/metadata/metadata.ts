import {
  MetadataActionDefinition,
  MetadataMeshDefinition,
  MetadataNotifierDefinition,
  MetadataSpriteDefinition
} from '../../../base'
import { ActorActionConstructor } from '../../../decorators/actor/actor-action/actor-action-constructor'
import { SceneActionConstructor } from '../../../decorators/scene/scene-action/scene-action-constructor'
import { FlexId } from '../../../types'
import { MetadataParticleDefinition } from './metadata-particle-definition'
import { MetadataProps } from './metadata-props'

export class Metadata<A extends ActorActionConstructor | SceneActionConstructor = any> {
  actions: MetadataActionDefinition<A>[] = []
  sprites: MetadataSpriteDefinition[] = []
  meshes: MetadataMeshDefinition[] = []
  particles: MetadataParticleDefinition[] = []
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
    this.particles.forEach(definition => {
      _class[definition.propertyName] = definition.classDefinition
    })
  }

  /**
   * Returns the equivalent to the decorator props, that have been added through decorators
   */
  getProps(): MetadataProps<A> {
    return {
      actions: this.actions.map(definition => definition.classDefinition),
      sprites: this.sprites.map(definition => definition.classDefinition),
      meshes: this.meshes.map(definition => definition.classDefinition),
      particles: this.particles.map(definition => definition.classDefinition)
    }
  }
}
