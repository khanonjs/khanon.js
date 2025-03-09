import * as BABYLON from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable,
  Metadata,
  Notificable
} from '../../base'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { FlexId } from '../../types/flex-id'
import { SceneInterface } from '../scene/scene-interface'

export abstract class CameraInterface<S = any, C extends SceneInterface = SceneInterface> implements LoopUpdatable, CanvasResizable, Notificable {
  abstract _loopUpdate: boolean
  abstract metadata: Metadata
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract start(): void
  abstract stop(): void
  abstract release(): void

  /**
   * User available
   */
  abstract scene: C
  abstract setup: S
  abstract loopUpdate: boolean
  abstract babylon: Pick<BabylonAccessor<BABYLON.Camera>, 'camera' | 'scene'>
  abstract getClassName(): string
  abstract notify(message: FlexId, ...args: any[]): void
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
