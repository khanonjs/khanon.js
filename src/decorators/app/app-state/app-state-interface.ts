import * as BABYLON from '@babylonjs/core'

import { StateInterface } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { Rect } from '../../../models/rect'
import { FlexId } from '../../../types/flex-id'
// import { GUIInterface } from '../../gui/gui-interface'
import { AppStateProps } from './app-state-props'

export abstract class AppStateInterface<S = any> implements StateInterface<S> {
  abstract props: AppStateProps
  abstract _metadata: Metadata
  abstract _loopUpdate: boolean
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  // abstract guis: Set<GUIInterface>
  // abstract guisStart(): void
  // abstract guisRelease(): void
  abstract _start(setup: any): void
  abstract _end(): void

  /**
   * User available
   */
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
