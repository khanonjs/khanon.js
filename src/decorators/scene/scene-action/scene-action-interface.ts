import * as BABYLON from '@babylonjs/core'

import { ActionInterface } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { Rect } from '../../../models/rect'
import { SceneInterface } from '../scene-interface'
import { SceneActionProps } from './scene-action-props'

export abstract class SceneActionInterface<S = any, C extends SceneInterface = SceneInterface> implements ActionInterface<S> {
  abstract props: SceneActionProps
  abstract metadata: Metadata
  abstract _loopUpdate: boolean
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract start(setup: S): void

  /**
   * User available
   */
  abstract get scene(): C
  abstract get setup(): S
  abstract set loopUpdate(value: boolean)
  abstract get loopUpdate(): boolean
  abstract play(): void
  abstract stop(): void // Callable from user Action, it will call to 'owner.stopActionFromInstance', then owner calls 'action.end' after remove it.
  abstract remove(): void

  /**
   * User defined optional
   */
  onPlay?(): void
  onStop?(): void
  onRemove?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
