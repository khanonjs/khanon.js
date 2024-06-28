import { Observer } from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable
} from '../../base'
import { CameraConstructor } from '../../constructors'
import { Rect } from '../../models'
import { SceneType } from '../scene/scene-type'

export abstract class SceneStateInterface implements LoopUpdatable, CanvasResizable {
  /**
   * Private
   */
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>
  abstract start?(): void
  abstract end?(): void

  /**
   * Public
   */
  abstract scene: SceneType
  abstract loopUpdate: boolean
  abstract setCamera(camera: CameraConstructor): void

  /**
   * User defined
   */
  onStart?(scene: SceneType): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
