import {
  Camera as BabylonCamera,
  Observer,
  Scene as BabylonScene
} from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable
} from '../../base'
import {
  BabylonAccessor,
  Rect
} from '../../models'

export abstract class CameraInterface implements LoopUpdatable, CanvasResizable {
  abstract babylon: Pick<BabylonAccessor<BabylonCamera>, 'camera'>
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>
  abstract start?(): void
  abstract stop?(): void
  initialize?(scene: BabylonScene): BabylonCamera
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
