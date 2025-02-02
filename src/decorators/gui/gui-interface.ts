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
import { GUIStateConstructor } from './gui-state/gui-state-constructor'
import { GUIStateInterface } from './gui-state/gui-state-interface'

export abstract class GUIInterface<S = any> implements LoopUpdatable, CanvasResizable, Notificable {
  abstract _loopUpdate: boolean
  abstract _state: GUIStateInterface | null
  abstract metadata: Metadata
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract start(): void
  abstract stop(): void
  abstract release(): void

  /**
   * User available
   */
  abstract setup: S
  abstract loopUpdate: boolean
  abstract babylon: Pick<BabylonAccessor<BABYLON.Camera>, 'gui' | 'scene'>
  abstract get state(): GUIStateInterface | null
  abstract switchState(state: GUIStateConstructor, setup: any): GUIStateInterface
  abstract show(): void
  abstract hide(): void
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined optional
   */
  onStart?(): void
  onStop?(): void
  onShow?(): void
  onHide?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
