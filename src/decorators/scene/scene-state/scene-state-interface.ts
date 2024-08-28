import * as BABYLON from '@babylonjs/core'

import { StateInterface } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { Rect } from '../../../models/rect'
import { FlexId } from '../../../types'
import { CameraConstructor } from '../../camera/camera-constructor'
import { SceneInterface } from '../scene-interface'

export abstract class SceneStateInterface<S = any, C = SceneInterface> implements StateInterface<S> {
  abstract metadata?: Metadata
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract start(setup: any): void
  abstract end(): void

  /**
   * User available
   */
  abstract scene: C
  abstract setup: S
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)
  abstract setCamera(camera: CameraConstructor, setup: any): void
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined optional
   */
  onStart?(): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
