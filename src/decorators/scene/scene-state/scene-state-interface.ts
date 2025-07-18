import { Observer } from '@babylonjs/core/Misc/observable'

import { StateInterface } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { BabylonAccessor } from '../../../models/babylon-accessor'
import { Rect } from '../../../models/rect'
import { Timeout } from '../../../models/timeout'
import { FlexId } from '../../../types/flex-id'
import { CameraConstructor } from '../../camera/camera-constructor'
import { CameraInterface } from '../../camera/camera-interface'
import { GUIConstructor } from '../../gui/gui-constructor'
import { GUIInterface } from '../../gui/gui-interface'
import { SceneInterface } from '../scene-interface'
import { SceneRemove } from '../scene-remove'
import { SceneSpawn } from '../scene-spawn'
import { SceneStateConstructor } from './scene-state-constructor'
import { SceneStateProps } from './scene-state-props'

export abstract class SceneStateInterface<S = any, C = SceneInterface> implements StateInterface<S> {
  abstract _props: SceneStateProps
  abstract _metadata: Metadata
  abstract _loopUpdate: boolean
  abstract _loopUpdate$: Observer<number>
  abstract _canvasResize$: Observer<Rect>
  abstract _spawn: SceneSpawn
  abstract _remove: SceneRemove
  abstract _start(setup: any): void
  abstract _end(): void

  /**
   * User available
   */
  abstract get babylon(): Pick<BabylonAccessor, 'scene'>
  abstract scene: C
  abstract setup: S
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)
  abstract get spawn(): SceneSpawn
  abstract get remove(): SceneRemove
  abstract getClassName(): string
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(timeout: Timeout): void
  abstract clearAllTimeouts(): void
  abstract showGUI<G extends GUIInterface>(gui: GUIConstructor, setup: any): G
  abstract hideGUI(gui: GUIConstructor): void
  abstract getGUI<G extends GUIInterface>(gui: GUIConstructor): G | undefined
  abstract switchCamera(camera: CameraConstructor, setup: any): void
  abstract getCamera<C extends CameraInterface = CameraInterface>(): C
  abstract switchState(state: SceneStateConstructor, setup: any): void
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined optional
   */
  onStart?(): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
