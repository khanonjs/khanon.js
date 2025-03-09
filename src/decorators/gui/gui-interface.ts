import * as BABYLON from '@babylonjs/core'
import * as BABYLONGUI from '@babylonjs/gui'

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
import { GUIStateConstructor } from './gui-state/gui-state-constructor'
import { GUIStateInterface } from './gui-state/gui-state-interface'

export abstract class GUIInterface<S = any> implements LoopUpdatable, CanvasResizable, Notificable {
  abstract _loopUpdate: boolean
  // abstract _state: GUIStateInterface | null
  abstract metadata: Metadata
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract initialize(setup: S): void
  abstract release(): void

  /**
   * User available
   */
  abstract loopUpdate: boolean
  abstract babylon: Pick<BabylonAccessor, 'gui'>
  abstract scene: SceneInterface
  abstract setup: S
  // abstract get state(): GUIStateInterface | null
  abstract getClassName(): string
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
