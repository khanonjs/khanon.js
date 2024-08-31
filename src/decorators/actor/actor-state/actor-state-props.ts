import { MeshConstructor } from '../../mesh/mesh-constructor'
import { SpriteConstructor } from '../../sprite/sprite-constructor'

export interface ActorStateProps {
  /**
   * Sprites to use in this state.
   */
  sprites?: SpriteConstructor[]

  /**
   * Meshes to use in this state.
   */
  meshes?: MeshConstructor[]
}
