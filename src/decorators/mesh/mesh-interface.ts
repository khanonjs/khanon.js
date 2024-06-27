import {
  Mesh as BabylonMesh,
  Observer
} from '@babylonjs/core'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { DisplayObject } from '../../base/classes/display-object'
import {
  BabylonAccessor,
  Rect
} from '../../models'
import { MeshTransform } from '../../types'
import { SceneInterface } from '../scene/scene-interface'
import { SceneType } from '../scene/scene-type'

export abstract class MeshInterface extends DisplayObject {
  /**
   * Private
   */
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>

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
  onSpawn?(scene: SceneInterface): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
