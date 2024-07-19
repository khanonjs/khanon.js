import {
  MetadataActionDefinition,
  MetadataMeshDefinition,
  MetadataSpriteDefinition
} from '../../base'
import { ActorActionConstructor } from '../../constructors/actor-action-constructor'
import { ActorProps } from './actor-props'

export class ActorMetadata {
  actions: MetadataActionDefinition<ActorActionConstructor>[] = []
  sprites: MetadataSpriteDefinition[] = []
  meshes: MetadataMeshDefinition[] = []

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

  getProps(): ActorProps {
    return {
      actions: this.actions.map(definition => definition.classDefinition),
      sprites: this.sprites.map(definition => definition.classDefinition),
      meshes: this.meshes.map(definition => definition.classDefinition)
    }
  }
}
