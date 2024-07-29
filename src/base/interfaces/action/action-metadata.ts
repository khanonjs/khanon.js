import {
  MetadataMeshDefinition,
  MetadataSpriteDefinition
} from '../../../base'
import { ActionProps } from './action-props'

export class ActionMetadata {
  sprites: MetadataSpriteDefinition[] = []
  meshes: MetadataMeshDefinition[] = []

  applyProps(_class: any): void {
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
  getProps(): ActionProps<any> {
    return {
      sprites: this.sprites.map(definition => definition.classDefinition),
      meshes: this.meshes.map(definition => definition.classDefinition)
    }
  }
}
