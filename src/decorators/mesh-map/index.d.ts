import { BabylonAccessor } from '../../models'

/**
 * @param S Camera setup object.
 */
export declare abstract class MeshMapInterface {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'scene'>
}

export type MeshMapConstructor = new () => MeshMapInterface

export declare function MeshMap(): any
