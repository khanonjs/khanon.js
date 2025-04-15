import * as BABYLON from '@babylonjs/core'

import { StateInterface } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { Rect } from '../../../models/rect'
import { Timeout } from '../../../models/timeout'
import { FlexId } from '../../../types/flex-id'
// import { GUIInterface } from '../../gui/gui-interface'
import { AppStateProps } from './app-state-props'

export abstract class AppStateInterface<S = any> implements StateInterface<S> {
  abstract _props: AppStateProps
  abstract _metadata: Metadata
  abstract _loopUpdate: boolean
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  // abstract _guis: Set<GUIInterface>
  // abstract _guisStart(): void
  // abstract _guisRelease(): void
  abstract _start(setup: any): void
  abstract _end(): void

  /**
   * User available
   */
  abstract setup: S
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)
  abstract getClassName(): string
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(interval: Timeout): void
  abstract clearAllTimeouts(): void
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined optional
   */
  onStart?(): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
