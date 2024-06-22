import { Mesh as BabylonMesh } from '@babylonjs/core'

import { BabylonAccessor } from '../../models'
import { SceneInterface } from '../scene/scene-interface'

export abstract class MeshInterface {
  /**
   * Public
   */
  abstract babylon: Pick<BabylonAccessor, 'scene'>

  abstract setMesh(babylonMesh: BabylonMesh): void

  /**
   * User defined
   */
  abstract onSpawn?(scene: SceneInterface): void
}
