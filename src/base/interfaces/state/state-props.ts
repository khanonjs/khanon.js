import { MeshConstructor } from '../../../decorators/mesh/mesh-constructor'
import { SpriteConstructor } from '../../../decorators/sprite/sprite-constructor'

export interface StateProps {
  /**
   * Sprites to use in this action.
   */
  sprites?: SpriteConstructor[]

  /**
   * Meshes to use in this action.
   */
  meshes?: MeshConstructor[]
}
