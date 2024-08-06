import * as BABYLON from '@babylonjs/core'

import { SceneInterface } from '../../../decorators/scene/scene-interface'
import { Rect } from '../../../models/rect'
import { CanvasResizable } from '../canvas-resizable'
import { LoopUpdatable } from '../loop-updatable'
import { Metadata } from '../metadata/metadata'

export abstract class ActionInterface<S = any> implements LoopUpdatable, CanvasResizable {
  abstract metadata?: Metadata
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract canvasResize$?: BABYLON.Observer<Rect>
  abstract start?(setup: S): void
  abstract end?(): void

  /**
   * User available
   */
  abstract setup: S
  abstract loopUpdate: boolean
  abstract get scene(): SceneInterface
  abstract stop(): void // Callable from user Action, it will call to 'owner.stopActionFromInstance', then owner calls 'action.end' after remove it.

  /**
   * User defined
   */
  onPlay?(): void
  onStop?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
