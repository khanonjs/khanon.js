import * as BABYLON from '@babylonjs/core'

import { DisplayObject } from '../../base'
import {
  BabylonAccessor,
  Rect
} from '../../models'
import { MeshTransform } from '../../types'
import { SceneInterface } from '../scene/scene-interface'

export abstract class MeshInterface extends DisplayObject {
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract canvasResize$?: BABYLON.Observer<Rect>
  abstract initialize?(): void

  /**
   * User available
   */
  abstract babylon: Pick<BabylonAccessor, 'mesh'>
  abstract scene: SceneInterface
  abstract transform: MeshTransform
  abstract loopUpdate: boolean
  abstract setMesh(babylonMesh: BABYLON.Mesh): void

  /**
   * User defined
   */
  onSpawn?(scene: SceneInterface): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
