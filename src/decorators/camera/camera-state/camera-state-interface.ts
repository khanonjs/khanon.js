

import { StateInterface } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { BabylonAccessor } from '../../../models/babylon-accessor'
import { Rect } from '../../../models/rect'
import { Timeout } from '../../../models/timeout'
import { FlexId } from '../../../types/flex-id'
import { SceneInterface } from '../../scene/scene-interface'
import { CameraInterface } from '../camera-interface'
import { CameraStateConstructor } from './camera-state-constructor'
import { CameraStateProps } from './camera-state-props'

export abstract class CameraStateInterface<S = any, D = CameraInterface, C = SceneInterface> implements StateInterface<S> {
  abstract _props: CameraStateProps
  abstract _metadata: Metadata
  abstract _loopUpdate: boolean
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract _start(setup: any): void
  abstract _end(): void

  /**
   * User available
   */
  abstract get babylon(): Pick<BabylonAccessor, 'scene'>
  abstract scene: C
  abstract camera: D
  abstract setup: S
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)
  abstract getClassName(): string
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(timeout: Timeout): void
  abstract clearAllTimeouts(): void
  abstract switchState(state: CameraStateConstructor, setup: any): void
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined optional
   */
  onStart?(): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
