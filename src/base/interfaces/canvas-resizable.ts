import { Observer } from '@babylonjs/core'

import { Rect } from '../../models'

export abstract class CanvasResizable {
  abstract canvasResize$?: Observer<Rect>
  abstract onCanvasResize?(canvasRect: Rect): void
}
