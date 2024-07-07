import {
  Mesh as BabylonMesh,
  Observer
} from '@babylonjs/core'

import { DisplayObject } from '../../base'
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
  abstract initialize?(): void

  /**
   * Public
   */
  abstract babylon: Pick<BabylonAccessor, 'mesh'>
  abstract scene: SceneType
  abstract transform: MeshTransform
  abstract loopUpdate: boolean
  abstract setMesh(babylonMesh: BabylonMesh): void

  /**
   * User defined
   */
  onSpawn?(scene: SceneInterface): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
