import { ActorMeshDefinition } from './actor-mesh-definition'
import { ActorProps } from './actor-props'
import { ActorSpriteDefinition } from './actor-sprite-definition'

export class ActorMetadata {
  sprites: ActorSpriteDefinition[] = []
  meshes: ActorMeshDefinition[] = []

  getProps(): ActorProps {
    return {
      sprites: this.sprites.map(definition => definition.classDefinition),
      meshes: this.meshes.map(definition => definition.classDefinition)
    }
  }
}
