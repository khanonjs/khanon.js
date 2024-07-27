import * as BABYLON from '@babylonjs/core'

import { Rect } from '../../../models/rect'
import { CanvasResizable } from '../canvas-resizable'
import { LoopUpdatable } from '../loop-updatable'

export abstract class StateInterface<S = any> implements LoopUpdatable, CanvasResizable {
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract canvasResize$?: BABYLON.Observer<Rect>
  abstract start?(setup: any): void
  abstract end?(): void

  /**
   * User available
   */
  abstract setup: S
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)

  /**
   * User defined
   */
  onStart?(): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
