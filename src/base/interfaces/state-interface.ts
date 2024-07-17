import { Observer } from '@babylonjs/core'

import { Rect } from '../../models/rect'
import { CanvasResizable } from './canvas-resizable'
import { LoopUpdatable } from './loop-updatable'

export abstract class StateInterface<S = any> implements LoopUpdatable, CanvasResizable {
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>
  abstract start?(): void
  abstract end?(): void

  /**
   * User available
   */
  abstract setup: S
  abstract loopUpdate: boolean

  /**
   * User defined
   */
  onStart?(): void
  onSetup?(): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
