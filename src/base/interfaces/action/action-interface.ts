import { SceneInterface } from '../../../decorators/scene/scene-interface'
import { BabylonAccessor } from '../../../models/babylon-accessor'
import { Rect } from '../../../models/rect'
import { Timeout } from '../../../models/timeout'
import { CanvasResizable } from '../canvas-resizable'
import { Configurable } from '../configurable'
import { LoopUpdatable } from '../loop-updatable'
import { Metadata } from '../metadata/metadata'
import { TimersByContext } from '../timers-by-context'

export abstract class ActionInterface<S = any> implements LoopUpdatable, CanvasResizable, TimersByContext, Configurable<S> {
  abstract _metadata: Metadata
  abstract _loopUpdate: boolean
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract _start(setup: S): void

  /**
   * User available
   */
  abstract get babylon(): Pick<BabylonAccessor, 'scene'>
  abstract scene: SceneInterface
  abstract setup: S
  abstract set loopUpdate(value: boolean)
  abstract get loopUpdate(): boolean
  abstract play(): void
  abstract stop(): void
  abstract remove(): void
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(timeout: Timeout): void
  abstract clearAllTimeouts(): void

  /**
   * User defined optional
   */
  abstract onPlay?(): void
  abstract onStop?(): void
  abstract onLoopUpdate?(delta: number): void
  abstract onCanvasResize?(size: Rect): void
}
