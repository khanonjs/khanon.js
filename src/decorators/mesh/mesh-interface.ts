import { Mesh as BabylonMesh } from '@babylonjs/core'

import { DisplayObject } from '../../base/classes/display-object'
import { BabylonAccessor } from '../../models'
import { SceneInterface } from '../scene/scene-interface'

export abstract class MeshInterface extends DisplayObject {
  /**
   * Public
   */
  abstract babylon: Pick<BabylonAccessor, 'scene' | 'mesh'>
  abstract setMesh(babylonMesh: BabylonMesh): void

  /**
   * User defined
   */
  abstract onSpawn?(scene: SceneInterface): void

  /**
   * Private
   */
  abstract release?(): void
}
