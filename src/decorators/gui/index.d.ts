import { BabylonAccessor } from '../../models'

/**
 * @param S Camera setup object.
 */
export declare abstract class GUIInterface {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'scene'>
}

export type GUIConstructor = new () => GUIInterface

export declare function GUI(): any
