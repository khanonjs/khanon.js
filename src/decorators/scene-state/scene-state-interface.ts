import { Observer } from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable
} from '../../base'
import { CameraConstructor } from '../../constructors'
import { Rect } from '../../models'
import { SceneType } from '../scene/scene-type'

export abstract class SceneStateInterface implements LoopUpdatable, CanvasResizable {
  abstract scene: SceneType
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>
  abstract setCamera(camera: CameraConstructor): void
  abstract start?(): void
  abstract end?(): void
  onStart?(scene: SceneType): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
