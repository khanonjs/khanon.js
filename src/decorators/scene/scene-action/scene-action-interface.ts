

import { ActionInterface } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { BabylonAccessor } from '../../../models/babylon-accessor'
import { Rect } from '../../../models/rect'
import { Timeout } from '../../../models/timeout'
import { SceneInterface } from '../scene-interface'
import { SceneActionProps } from './scene-action-props'

export abstract class SceneActionInterface<S = any, C extends SceneInterface = SceneInterface> implements ActionInterface<S> {
  abstract _props: SceneActionProps
  abstract _metadata: Metadata
  abstract _loopUpdate: boolean
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract _start(setup: S): void

  /**
   * User available
   */
  abstract get babylon(): Pick<BabylonAccessor, 'scene'>
  abstract scene: C
  abstract setup: S
  abstract set loopUpdate(value: boolean)
  abstract get loopUpdate(): boolean
  abstract getClassName(): string
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(timeout: Timeout): void
  abstract clearAllTimeouts(): void
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
