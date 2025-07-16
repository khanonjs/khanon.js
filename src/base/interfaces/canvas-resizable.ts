import { Observer } from '@babylonjs/core/Misc/observable'

import { Rect } from '../../models/rect'

export abstract class CanvasResizable {
  abstract _canvasResize$: Observer<Rect>

  /**
   * USer defined
   */
  abstract onCanvasResize?(size: Rect): void
}
