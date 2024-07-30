import * as BABYLON from '@babylonjs/core'

import {
  CanvasResizable,
  Loadable,
  LoadingProgress,
  LoopUpdatable,
  Notificable
} from '../../base'
import { AssetDefinition } from '../../models/asset-definition'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { FlexId } from '../../types'
import { ActorInterface } from '../actor/actor-interface'
import { CameraConstructor } from '../camera/camera-constructor'
import { MeshInterface } from '../mesh'
import { ParticleSourceInterface } from '../particle-source/particle-source-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteInterface } from '../sprite'
import { SceneRemove } from './'
import { SceneActionConstructor } from './scene-action/scene-action-constructor'
import { SceneActionInterface } from './scene-action/scene-action-interface'
import { SceneMetadata } from './scene-metadata'
import { SceneProps } from './scene-props'
import { SceneSpawn } from './scene-spawn'
import { SceneStateConstructor } from './scene-state/scene-state-constructor'
import { SceneStateInterface } from './scene-state/scene-state-interface'

export abstract class SceneInterface implements Loadable, LoopUpdatable, CanvasResizable, Notificable {
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
  abstract start(state: SceneStateConstructor, stateSetup: any): SceneStateInterface
  abstract stop(): void
  abstract load(): LoadingProgress
  abstract unload(): void
  abstract startState(state: SceneStateConstructor, setup: any): void
  abstract playAction(action: SceneActionConstructor | ((delta: number) => void), setup: any): void
  abstract stopAction(action: SceneActionConstructor): void
  abstract stopActionGroup(group: number): void
  abstract stopActionAll(): void
  abstract notify(message: FlexId, ...args: any[]): void

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
