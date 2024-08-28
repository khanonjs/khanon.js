import * as BABYLON from '@babylonjs/core'

import { SceneInterface } from '../../../decorators/scene/scene-interface'
import { Rect } from '../../../models/rect'
import { CanvasResizable } from '../canvas-resizable'
import { LoopUpdatable } from '../loop-updatable'
import { Metadata } from '../metadata/metadata'

// TODO: Use mixings for derived classes and add a single implementation!!

export abstract class ActionInterface<S = any> implements LoopUpdatable, CanvasResizable {
  abstract metadata: Metadata
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract start(setup: S): void
  abstract end(): void

  /**
   * User available
   */
  abstract get setup(): S
  abstract set loopUpdate(value: boolean)
  abstract get loopUpdate(): boolean
  abstract get scene(): SceneInterface
  abstract stop(): void // Callable from user Action, it will call to 'owner.stopActionFromInstance', then owner calls 'action.end' after remove it.
  abstract remove(): void

  /**
   * User defined optional
   */
  abstract onPlay?(): void
  abstract onStop?(): void
  abstract onLoopUpdate?(delta: number): void
  abstract onCanvasResize?(size: Rect): void
}
