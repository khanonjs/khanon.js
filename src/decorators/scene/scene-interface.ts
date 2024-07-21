import * as BABYLON from '@babylonjs/core'

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
import { ActorInterface } from '../actor/actor-interface'
import { SceneActionInterface } from './scene-action/scene-action-interface'
import { SceneActionOptions } from './scene-action/scene-action-options'
import { SceneMetadata } from './scene-metadata'
import { SceneSpawn } from './scene-spawn'
import { SceneStateInterface } from './scene-state/scene-state-interface'
import { SceneStateOptions } from './scene-state/scene-state-options'

export abstract class SceneInterface implements Loadable, LoopUpdatable, CanvasResizable {
  abstract metadata?: SceneMetadata
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract canvasResize$?: BABYLON.Observer<Rect>
  abstract actions?: Map<SceneActionConstructor, SceneActionInterface>
  abstract stopActionFromInstance?(instance: SceneActionInterface): void

  /**
   * User available
   */
  abstract babylon: Pick<BabylonAccessor, 'scene'>
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)
  abstract get loaded(): boolean
  abstract get started(): boolean
  abstract get state(): SceneStateInterface
  abstract get spawn(): SceneSpawn
  abstract start(state: SceneStateConstructor): SceneStateInterface
  abstract stop(): void
  abstract load(): LoadingProgress
  abstract unload(): void
  abstract startState(state: SceneStateConstructor): SceneStateOptions<any>
  abstract playAction(action: SceneActionConstructor | ((delta: number) => void)): SceneActionOptions<any>
  abstract stopAction(action: SceneActionConstructor): void
  abstract stopActionGroup(group: number): void
  abstract stopActionAll(): void
  abstract removeActor(actor: ActorInterface): void

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
