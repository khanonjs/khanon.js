import * as BABYLON from '@babylonjs/core'

import { StateInterface } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { Rect } from '../../../models/rect'
import { FlexId } from '../../../types/flex-id'
import { GUIInterface } from '../gui-interface'
import { GUIStateProps } from './gui-state-props'

export abstract class GUIStateInterface<S = any, C = GUIInterface> implements StateInterface<S> {
  abstract props: GUIStateProps
  abstract metadata: Metadata
  abstract _loopUpdate: boolean
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract start(setup: any): void
  abstract _end(): void

  /**
   * User available
   */
  abstract gui: GUIInterface
  abstract setup: S
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)
  abstract getClassName(): string
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined optional
   */
  onStart?(): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
