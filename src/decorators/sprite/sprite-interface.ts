import { BabylonAccessor } from '../../models'
import { SceneInterface } from '../scene/scene-interface'

export abstract class SpriteInterface {
  /**
   * Public
   */
  abstract babylon: Pick<BabylonAccessor, 'spriteManager' | 'scene'>

  /**
   * User defined
   */
  abstract onSpawn?(scene: SceneInterface): void
}
