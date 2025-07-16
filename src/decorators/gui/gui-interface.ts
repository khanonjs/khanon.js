
import * as BABYLONGUI from '@babylonjs/gui'

import {
  CanvasResizable,
  LoopUpdatable,
  Metadata,
  Notificable
} from '../../base'
import { Configurable } from '../../base/interfaces/configurable'
import { TimersByContext } from '../../base/interfaces/timers-by-context'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { FlexId } from '../../types/flex-id'
import { SceneInterface } from '../scene/scene-interface'
import { GUIStateConstructor } from './gui-state/gui-state-constructor'
import { GUIStateInterface } from './gui-state/gui-state-interface'

export abstract class GUIInterface<S = any> implements LoopUpdatable, CanvasResizable, Notificable, TimersByContext, Configurable<S> {
  abstract _loopUpdate: boolean
  // abstract _state: GUIStateInterface | null
  abstract _metadata: Metadata
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract _initialize(setup: S): void
  abstract _release(): void

  /**
   * User available
   */
  abstract babylon: Pick<BabylonAccessor, 'gui' | 'scene'>
  abstract scene: SceneInterface
  abstract setup: S
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)
  // abstract get state(): GUIStateInterface | null
  abstract getClassName(): string
  // abstract switchState(state: GUIStateConstructor, setup: any): GUIStateInterface
  // abstract show(): void
  // abstract hide(): void
  abstract notify(message: FlexId, ...args: any[]): void
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(timeout: Timeout): void
  abstract clearAllTimeouts(): void

  /**
   * User defined mandatory (abstract on .d.ts)
   */
  onInitialize?(container: BABYLONGUI.AdvancedDynamicTexture): void

  /**
   * User defined optional
   */
  // onShow?(): void
  // onHide?(): void
  onDestroy?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
