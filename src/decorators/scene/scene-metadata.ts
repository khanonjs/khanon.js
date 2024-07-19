import {
  MetadataActionDefinition,
  MetadataMeshDefinition,
  MetadataSpriteDefinition
} from '../../base'
import { SceneActionConstructor } from '../../constructors/scene-action-constructor'
import { SceneProps } from './scene-props'

export class SceneMetadata {
  actions: MetadataActionDefinition<SceneActionConstructor>[] = []
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

  getProps(): SceneProps {
    return {
      actions: this.actions.map(definition => definition.classDefinition),
      sprites: this.sprites.map(definition => definition.classDefinition),
      meshes: this.meshes.map(definition => definition.classDefinition)
    }
  }
}
