import * as BABYLON from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable
} from '../../base'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'

export abstract class CameraInterface<S = any> implements LoopUpdatable, CanvasResizable {
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract canvasResize$?: BABYLON.Observer<Rect>
  abstract start?(): void
  abstract stop?(): void

  /**
   * User available
   */
  abstract setup: S
  abstract loopUpdate: boolean
  abstract babylon: Pick<BabylonAccessor<BABYLON.Camera>, 'camera'>

  /**
   * User defined
   */
  initialize?(scene: BABYLON.Scene): BABYLON.Camera
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
