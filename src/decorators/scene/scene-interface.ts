import { Observer } from '@babylonjs/core'

import {
  CanvasResizable,
  Loadable,
  LoadingProgress,
  LoopUpdatable
} from '../../base'
import { SceneStateConstructor } from '../../constructors/scene-state-constructor'
import { Rect } from '../../models'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { SceneStateInterface } from '../scene-state/scene-state-interface'
import { SceneSpawn } from './scene-spawn'

export abstract class SceneInterface implements Loadable, LoopUpdatable, CanvasResizable {
  /**
   * Private
   */
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>

  /**
   * Public
   */
  abstract babylon: Pick<BabylonAccessor, | 'scene'>
  abstract loopUpdate: boolean
  abstract get loaded(): boolean
  abstract get started(): boolean
  abstract get state(): SceneStateInterface
  abstract get spawn(): SceneSpawn
  abstract start(state: SceneStateConstructor): void
  abstract stop(): void
  abstract load(): LoadingProgress
  abstract unload(): void
  abstract startState(state: SceneStateConstructor): void

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
