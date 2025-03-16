import * as BABYLON from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable,
  Metadata,
  Notificable
} from '../../base'
import { Configurable } from '../../base/interfaces/configurable'
import { TimersByContext } from '../../base/interfaces/timers-by-context'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { FlexId } from '../../types/flex-id'
import { SceneInterface } from '../scene/scene-interface'

export abstract class CameraInterface<S = any, C extends SceneInterface = SceneInterface> implements LoopUpdatable, CanvasResizable, Notificable, TimersByContext, Configurable<S> {
  abstract _loopUpdate: boolean
  abstract _metadata: Metadata
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract _start(): void
  abstract _stop(): void
  abstract _release(): void

  /**
   * User available
   */
  abstract scene: C
  abstract setup: S
  abstract babylon: Pick<BabylonAccessor<BABYLON.Camera>, 'camera' | 'scene'>
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)
  abstract getClassName(): string
  abstract notify(message: FlexId, ...args: any[]): void
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(timeout: Timeout): void
  abstract clearAllTimeouts(): void
  // TODO attach particles to camera to simulate environment effects?

  /**
   * User defined mandatory (abstract on .d.ts)
   */
  onInitialize?(scene: BABYLON.Scene): BABYLON.Camera

  /**
   * User defined optional
   */
  onStart?(): void
  onStop?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
