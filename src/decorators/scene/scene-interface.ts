import * as BABYLON from '@babylonjs/core'

import {
  CanvasResizable,
  Loadable,
  LoadingProgress,
  LoopUpdatable
} from '../../base'
import { CameraConstructor } from '../../constructors/camera-constructor'
import { SceneActionConstructor } from '../../constructors/scene-action-constructor'
import { SceneStateConstructor } from '../../constructors/scene-state-constructor'
import { AssetDefinition } from '../../models/asset-definition'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { ActorInterface } from '../actor/actor-interface'
import { MeshInterface } from '../mesh'
import { ParticleSourceInterface } from '../particle-source/particle-source-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteInterface } from '../sprite'
import { SceneRemove } from './'
import { SceneActionInterface } from './scene-action/scene-action-interface'
import { SceneActionOptions } from './scene-action/scene-action-options'
import { SceneMetadata } from './scene-metadata'
import { SceneProps } from './scene-props'
import { SceneSpawn } from './scene-spawn'
import { SceneStateInterface } from './scene-state/scene-state-interface'
import { SceneStateOptions } from './scene-state/scene-state-options'

export abstract class SceneInterface implements Loadable, LoopUpdatable, CanvasResizable {
  abstract props?: SceneProps
  protected abstract _assets?: AssetDefinition[]
  protected abstract _loaded?: boolean
  protected abstract _started?: boolean
  abstract assets?: AssetDefinition[]
  abstract metadata?: SceneMetadata
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract canvasResize$?: BABYLON.Observer<Rect>
  abstract actions?: Map<SceneActionConstructor, SceneActionInterface>
  protected abstract _spawn?: SceneSpawn
  protected abstract _remove?: SceneRemove
  abstract actors?: Set<ActorInterface>
  abstract particles?: Set<ParticleInterface>
  abstract particleSources?: Set<ParticleSourceInterface>
  abstract meshes?: Set<MeshInterface>
  abstract sprites?: Set<SpriteInterface>
  abstract setCamera?(camera: CameraConstructor): void
  abstract setEngineParams?(): void
  abstract renderStart?(id: string): void
  abstract renderStop?(id: string): void
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
  abstract get remove(): SceneRemove
  abstract start(state: SceneStateConstructor): SceneStateInterface
  abstract stop(): void
  abstract load(): LoadingProgress
  abstract unload(): void
  abstract startState(state: SceneStateConstructor): SceneStateOptions<any>
  abstract playAction(action: SceneActionConstructor | ((delta: number) => void)): SceneActionOptions<any>
  abstract stopAction(action: SceneActionConstructor): void
  abstract stopActionGroup(group: number): void
  abstract stopActionAll(): void

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
