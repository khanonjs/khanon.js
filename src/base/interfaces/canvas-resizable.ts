import * as BABYLON from '@babylonjs/core'

import { Rect } from '../../models/rect'

export abstract class CanvasResizable {
  abstract canvasResize$: BABYLON.Observer<Rect>

  /**
   * USer defined
   */
  abstract onCanvasResize?(size: Rect): void
}
