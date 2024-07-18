import { ActorActionDefinition } from './actor-action-definition'
import { ActorMeshDefinition } from './actor-mesh-definition'
import { ActorProps } from './actor-props'
import { ActorSpriteDefinition } from './actor-sprite-definition'

export class ActorMetadata {
  actions: ActorActionDefinition[] = []
  sprites: ActorSpriteDefinition[] = []
  meshes: ActorMeshDefinition[] = []

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
