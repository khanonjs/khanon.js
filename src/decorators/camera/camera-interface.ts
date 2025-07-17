import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera'
import { Ray } from '@babylonjs/core/Culling/ray'
import {
  Matrix,
  Vector3
} from '@babylonjs/core/Maths/math.vector'
import { Observer } from '@babylonjs/core/Misc/observable'
import { Scene } from '@babylonjs/core/scene'

import {
  CanvasResizable,
  LoopUpdatable,
  Metadata,
  Notificable
} from '../../base'
import { Configurable } from '../../base/interfaces/configurable'
import { Stateable } from '../../base/interfaces/stateable'
import { TimersByContext } from '../../base/interfaces/timers-by-context'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { CameraTransform } from '../../types/camera-transform'
import { FlexId } from '../../types/flex-id'
import { SceneInterface } from '../scene/scene-interface'
import { CameraStateConstructor } from './camera-state/camera-state-constructor'
import { CameraStateInterface } from './camera-state/camera-state-interface'

export abstract class CameraInterface<S = any, C extends SceneInterface = SceneInterface> implements Stateable<CameraStateConstructor>, LoopUpdatable, CanvasResizable, Notificable, TimersByContext, Configurable<S>, CameraTransform {
  abstract _loopUpdate: boolean
  abstract _metadata: Metadata
  abstract _state: CameraStateInterface | null
  abstract _loopUpdate$: Observer<number>
  abstract _canvasResize$: Observer<Rect>
  abstract _start(): void
  abstract _stop(): void
  abstract _release(): void

  /**
   * User available
   */
  abstract scene: C
  abstract setup: S
  abstract babylon: Pick<BabylonAccessor<TargetCamera>, 'camera' | 'scene'>
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)
  abstract get state(): CameraStateInterface | null
  abstract getClassName(): string
  abstract notify(message: FlexId, ...args: any[]): void
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(timeout: Timeout): void
  abstract clearAllTimeouts(): void
  abstract switchState(state: CameraStateConstructor, setup: any): CameraStateInterface
  // FEAT attach particles to camera to simulate environment effects?

  /**
   * Tranmsform properties and methods
   */
  abstract position: Vector3
  abstract globalPosition: Vector3
  abstract upVector: Vector3
  abstract getDirection(localAxis: Vector3): Vector3
  abstract getDirectionToRef(localAxis: Vector3, result: Vector3): void
  abstract getForwardRay(length?: number, transform?: Matrix, origin?: Vector3): Ray
  abstract getProjectionMatrix(force?: boolean): Matrix
  abstract getWorldMatrix(): Matrix
  abstract rotation: Vector3
  abstract speed: number
  abstract target: Vector3

  /**
   * User defined mandatory (abstract on .d.ts)
   */
  onInitialize?(scene: Scene): TargetCamera

  /**
   * User defined optional
   */
  onStart?(): void
  onStop?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
