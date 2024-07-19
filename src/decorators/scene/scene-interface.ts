import { Observer } from '@babylonjs/core'

import {
  CanvasResizable,
  Loadable,
  LoadingProgress,
  LoopUpdatable
} from '../../base'
import { SceneActionConstructor } from '../../constructors/scene-action-constructor'
import { SceneStateConstructor } from '../../constructors/scene-state-constructor'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { SceneActionInterface } from './scene-action/scene-action-interface'
import { SceneActionOptions } from './scene-action/scene-action-options'
import { SceneMetadata } from './scene-metadata'
import { SceneSpawn } from './scene-spawn'
import { SceneStateInterface } from './scene-state/scene-state-interface'
import { SceneStateOptions } from './scene-state/scene-state-options'

export abstract class SceneInterface implements Loadable, LoopUpdatable, CanvasResizable {
  abstract metadata?: SceneMetadata
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>
  abstract actions?: Map<SceneActionConstructor, SceneActionInterface>

  /**
   * User available
   */
  abstract babylon: Pick<BabylonAccessor, 'scene'>
  abstract loopUpdate: boolean
  abstract get loaded(): boolean
  abstract get started(): boolean
  abstract get state(): SceneStateInterface
  abstract get spawn(): SceneSpawn
  abstract start(state: SceneStateConstructor): SceneStateInterface
  abstract stop(): void
  abstract load(): LoadingProgress
  abstract unload(): void
  abstract startState(state: SceneStateConstructor): SceneStateOptions<any>
  abstract playAction(action: SceneActionConstructor | ((delta: number) => void)): SceneActionOptions<any> // 8a8f quitar el delta
  abstract stopAction(action: SceneActionConstructor): void
  abstract stopActionGroup(group: number): void

  /**
   * User defined
   */
  onStart?(): void
  onStop?(): void
  onLoaded?(): void
  onUnload?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
