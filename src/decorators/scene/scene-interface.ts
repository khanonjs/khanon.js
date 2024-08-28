import * as BABYLON from '@babylonjs/core'

import {
  CanvasResizable,
  Loadable,
  LoadingProgress,
  LoopUpdatable,
  Notificable
} from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { AssetDefinition } from '../../models/asset-definition'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { FlexId } from '../../types'
import { ActorInterface } from '../actor/actor-interface'
import { CameraConstructor } from '../camera/camera-constructor'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteInterface } from '../sprite/sprite-interface'
import { SceneActionConstructor } from './scene-action/scene-action-constructor'
import { SceneActionInterface } from './scene-action/scene-action-interface'
import { SceneAvailableElements } from './scene-available-elements'
import { SceneProps } from './scene-props'
import { SceneRemove } from './scene-remove'
import { SceneSpawn } from './scene-spawn'
import { SceneStateConstructor } from './scene-state/scene-state-constructor'
import { SceneStateInterface } from './scene-state/scene-state-interface'

export abstract class SceneInterface implements Loadable, LoopUpdatable, CanvasResizable, Notificable {
  abstract props: SceneProps
  protected abstract _assets: AssetDefinition[]
  protected abstract _loaded: boolean
  protected abstract _started: boolean
  protected abstract _spawn: SceneSpawn
  protected abstract _remove: SceneRemove
  abstract availableElements: SceneAvailableElements
  abstract assets: AssetDefinition[]
  abstract metadata: Metadata
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract actions: Map<SceneActionConstructor, SceneActionInterface>
  abstract actors: Set<ActorInterface>
  abstract particles: Set<ParticleInterface>
  abstract meshes: Set<MeshInterface>
  abstract sprites: Set<SpriteInterface>
  abstract setEngineParams(): void // TODO ?
  abstract stopActionFromInstance(instance: SceneActionInterface, forceRemove?: boolean): void

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
  abstract setCamera(camera: CameraConstructor, setup: any): void
  abstract startState(state: SceneStateConstructor, setup: any): void
  abstract playAction(action: SceneActionConstructor | ((delta: number) => void), setup: any): void
  abstract stopAction(action: SceneActionConstructor): void
  abstract stopActionGroup(group: number): void
  abstract stopActionAll(): void
  abstract removeAction(actionConstructor: SceneActionConstructor, forceRemove?: boolean): void
  abstract removeActionGroup(group: number, forceRemove?: boolean): void
  abstract removeActionAll(forceRemove?: boolean): void
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined optional
   */
  onStart?(): void
  onStop?(): void
  onLoaded?(): void
  onUnload?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
