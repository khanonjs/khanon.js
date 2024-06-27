import { Mesh as BabylonMesh } from '@babylonjs/core'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { DisplayObject } from '../../base/classes/display-object'
import { BabylonAccessor } from '../../models'
import { MeshTransform } from '../../types'
import { SceneInterface } from '../scene/scene-interface'
import { SceneType } from '../scene/scene-type'

export abstract class MeshInterface extends DisplayObject {
  /**
   * Public
   */
  abstract babylon: Pick<BabylonAccessor, 'mesh'>
  abstract scene: SceneType
  abstract transform: MeshTransform
  abstract setMesh(babylonMesh: BabylonMesh): void

  /**
   * User defined
   */
  abstract onSpawn?(scene: SceneInterface): void
}
