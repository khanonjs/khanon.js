import * as BABYLON from '@babylonjs/core'

import { Rect } from '../../../models/rect'
import { FlexId } from '../../../types'
import { CanvasResizable } from '../canvas-resizable'
import { LoopUpdatable } from '../loop-updatable'
import { Notificable } from '../notificable'

export abstract class ActionInterface<S = any> implements LoopUpdatable, CanvasResizable, Notificable {
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract canvasResize$?: BABYLON.Observer<Rect>
  abstract start?(setup: S): void
  abstract end?(): void

  /**
   * User available
   */
  abstract setup: S
  abstract loopUpdate: boolean
  abstract stop(): void // Callable from user Action, it will call to 'owner.stopActionFromInstance', then owner calls 'action.end' after remove it.
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined
   */
  onPlay?(): void
  onStop?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
