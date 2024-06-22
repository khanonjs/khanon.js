import { BabylonAccessor } from '../../models'

export abstract class MeshInterface {
  /**
   * Public
   */
  abstract babylon: Pick<BabylonAccessor, 'scene'>

  /**
   * User defined
   */
  abstract onSpawn?(): void
}
