import * as BABYLON from '@babylonjs/core'

import { Rect } from '../../../models/rect'
import { CanvasResizable } from '../canvas-resizable'
import { LoopUpdatable } from '../loop-updatable'

export abstract class ActionInterface<S = any> implements LoopUpdatable, CanvasResizable {
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract canvasResize$?: BABYLON.Observer<Rect>
  abstract start?(): void
  abstract end?(): void

  /**
   * User available
   */
  abstract setup: S
  abstract loopUpdate: boolean
  abstract stop(): void // Callable from user Action, it will call to 'owner.stopActionFromInstance', then owner calls 'action.end' after remove it.

  /**
   * User defined
   */
  onStart?(): void
  onSetup?(): void
  onStop?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
