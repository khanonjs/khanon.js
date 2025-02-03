import * as BABYLON from '@babylonjs/core'
import * as BABYLON_GUI from '@babylonjs/gui'

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

export abstract class GUIInterface implements LoopUpdatable, CanvasResizable, Notificable {
  abstract _loopUpdate: boolean
  // abstract _state: GUIStateInterface | null
  abstract metadata: Metadata
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract container: BABYLON_GUI.AdvancedDynamicTexture
  abstract initialize(): void
  abstract release(): void

  /**
   * User available
   */
  abstract loopUpdate: boolean
  abstract babylon: Pick<BabylonAccessor<BABYLON.Camera>, 'gui' | 'scene'>
  // abstract get state(): GUIStateInterface | null
  // abstract switchState(state: GUIStateConstructor, setup: any): GUIStateInterface
  // abstract show(): void
  // abstract hide(): void
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined mandatory (abstract on .d.ts)
   */
  onInitialize?(container: BABYLON.DynamicTexture): void

  /**
   * User defined optional
   */
  // onShow?(): void
  // onHide?(): void
  onDestroy?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
