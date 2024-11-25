import * as BABYLON from '@babylonjs/core'

import { SceneInterface } from '../../../decorators/scene/scene-interface'
import { Rect } from '../../../models/rect'
import { CanvasResizable } from '../canvas-resizable'
import { LoopUpdatable } from '../loop-updatable'
import { Metadata } from '../metadata/metadata'

// TODO: Use mixings for derived classes and use a single implementation!!

export abstract class ActionInterface<S = any> implements LoopUpdatable, CanvasResizable {
  abstract metadata: Metadata
  abstract _loopUpdate: boolean
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract start(setup: S): void

  /**
   * User available
   */
  abstract get setup(): S
  abstract set loopUpdate(value: boolean)
  abstract get loopUpdate(): boolean
  abstract get scene(): SceneInterface
  abstract play(): void
  abstract stop(): void
  abstract remove(): void

  /**
   * User defined optional
   */
  abstract onPlay?(): void
  abstract onStop?(): void
  abstract onLoopUpdate?(delta: number): void
  abstract onCanvasResize?(size: Rect): void
}
