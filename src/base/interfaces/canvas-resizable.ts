import { Observer } from '@babylonjs/core'

import { Rect } from '../../models/rect'

export abstract class CanvasResizable {
  abstract canvasResize$?: Observer<Rect>

  /**
   * USer defined
   */
  abstract onCanvasResize?(size: Rect): void
}
