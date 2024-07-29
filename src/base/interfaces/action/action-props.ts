import { MeshConstructor } from '../../../constructors/mesh-constructor'
import { SpriteConstructor } from '../../../constructors/sprite-constructor'

export interface ActionProps<O> {
  /**
   * All actions of a group can be stopped from 'actor.stopActionGroup'.
   */
  group?: number

  /**
   * 'false' by default. Preserves the action, not removing it after stop.
   */
  preserve?: boolean

  /**
   * List of actions to be overriden on action play.
   * NOTE: Overrides don't apply to method decorators.
   */
  overrides?: O[]

  /**
   * Count of number of frames this action is executed.
   */
  countFrames?: number

  /**
   * Sprites to use in this action.
   */
  sprites?: SpriteConstructor[]

  /**
   * Meshes to use in this action.
   */
  meshes?: MeshConstructor[]
}
