

import { BabylonAccessor } from '../../../models/babylon-accessor'
import { Rect } from '../../../models/rect'
import { Timeout } from '../../../models/timeout'
import { FlexId } from '../../../types/flex-id'
import { CanvasResizable } from '../canvas-resizable'
import { Configurable } from '../configurable'
import { LoopUpdatable } from '../loop-updatable'
import { Notificable } from '../notificable'
import { TimersByContext } from '../timers-by-context'

export abstract class StateInterface<S = any> implements LoopUpdatable, CanvasResizable, Notificable, TimersByContext, Configurable<S> {
  abstract _loopUpdate: boolean
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract _start(setup: any): void
  abstract _end(): void

  /**
   * User available
   */
  abstract setup: S
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)
  abstract notify(message: FlexId, ...args: any[]): void
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(timeout: Timeout): void
  abstract clearAllTimeouts(): void

  /**
   * User defined optional
   */
  abstract onStart?(): void
  abstract onEnd?(): void
  abstract onLoopUpdate?(delta: number): void
  abstract onCanvasResize?(size: Rect): void
}
