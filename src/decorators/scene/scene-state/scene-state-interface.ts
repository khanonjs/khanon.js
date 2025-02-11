import * as BABYLON from '@babylonjs/core'

import { StateInterface } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { Rect } from '../../../models/rect'
import { FlexId } from '../../../types/flex-id'
import { CameraConstructor } from '../../camera/camera-constructor'
import { CameraInterface } from '../../camera/camera-interface'
import { SceneInterface } from '../scene-interface'
import { SceneRemove } from '../scene-remove'
import { SceneSpawn } from '../scene-spawn'
import { SceneStateProps } from './scene-state-props'

export abstract class SceneStateInterface<S = any, C = SceneInterface> implements StateInterface<S> {
  abstract props: SceneStateProps
  abstract metadata: Metadata
  abstract _loopUpdate: boolean
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract _spawn: SceneSpawn
  abstract _remove: SceneRemove
  abstract start(setup: any): void
  abstract end(): void

  /**
   * User available
   */
  abstract scene: C
  abstract setup: S
  abstract get spawn(): SceneSpawn
  abstract get remove(): SceneRemove
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)
  abstract switchCamera(camera: CameraConstructor, setup: any): void
  abstract getCamera<C extends CameraInterface = CameraInterface>(): C
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined optional
   */
  onStart?(): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
