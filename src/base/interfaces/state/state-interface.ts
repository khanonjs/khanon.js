import * as BABYLON from '@babylonjs/core'

import { Rect } from '../../../models/rect'
import { FlexId } from '../../../types'
import { CanvasResizable } from '../canvas-resizable'
import { LoopUpdatable } from '../loop-updatable'
import { Notificable } from '../notificable'

export abstract class StateInterface<S = any> implements LoopUpdatable, CanvasResizable, Notificable {
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract start(setup: any): void
  abstract end(): void

  /**
   * User available
   */
  abstract setup: S
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined optional
   */
  abstract onStart?(): void
  abstract onEnd?(): void
  abstract onLoopUpdate?(delta: number): void
  abstract onCanvasResize?(size: Rect): void
}
