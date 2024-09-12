import { BabylonAccessor } from '../../models'

/**
 * @param S Camera setup object.
 */
export declare abstract class SpriteMapInterface {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'scene'>
}

export type SpriteMapConstructor = new () => SpriteMapInterface

export declare function SpriteMap(): any
