import * as BABYLON from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable
} from '../../base'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'

export abstract class CameraInterface implements LoopUpdatable, CanvasResizable {
  abstract babylon: Pick<BabylonAccessor<BABYLON.Camera>, 'camera'>
  abstract loopUpdate?: boolean
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract canvasResize$?: BABYLON.Observer<Rect>
  abstract start?(): void
  abstract stop?(): void
  initialize?(scene: BABYLON.Scene): BABYLON.Camera
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
