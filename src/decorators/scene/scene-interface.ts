import * as BABYLON from '@babylonjs/core'

import {
  AssetDefinition,
  CanvasResizable,
  Loadable,
  LoadingProgress,
  LoopUpdatable,
  Notificable
} from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { FlexId } from '../../types/flex-id'
import { ActorInterface } from '../actor/actor-interface'
import { CameraConstructor } from '../camera/camera-constructor'
import { CameraInterface } from '../camera/camera-interface'
import { GUIInterface } from '../gui/gui-interface'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteAnimation } from '../sprite/sprite-animation'
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
  abstract _assets: AssetDefinition[]
  abstract _loaded: boolean
  abstract _loadingProgress: LoadingProgress | undefined
  abstract _started: boolean
  abstract _state: SceneStateInterface | null
  abstract _spawn: SceneSpawn
  abstract _remove: SceneRemove
  abstract _camera: CameraInterface | undefined
  abstract _cameraConstructor: CameraConstructor
  abstract _loopUpdate: boolean
  abstract _debugInspector: (event: KeyboardEvent) => void
  abstract availableElements: SceneAvailableElements
  abstract assets: AssetDefinition[]
  abstract metadata: Metadata
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract actions: Map<SceneActionConstructor, SceneActionInterface>
  abstract actors: Set<ActorInterface>
  abstract meshes: Set<MeshInterface>
  abstract sprites: Set<SpriteInterface>
  abstract particles: Set<ParticleInterface>
  abstract animationHandler: Map<SpriteInterface, () => void>
  abstract guis: Set<GUIInterface>
  abstract guisStart(): void
  abstract guisRelease(): void
  abstract setEngineParams(): void // TODO ?
  abstract playActionFromInstance(instance: SceneActionInterface): void
  abstract stopActionFromInstance(instance: SceneActionInterface, forceRemove?: boolean): void
  abstract setAnimationHandler(sprite: SpriteInterface, animation: SpriteAnimation): void
  abstract stopAnimationHandler(sprite: SpriteInterface): void
  abstract startRenderObservable(): void
  abstract stopRenderObservable(): void
  abstract useBabylonSceneFromAsset(): LoadingProgress // 8a8f use for BabylonSceneMap?
  abstract useDebugInspector(): void
  abstract denyDebugInspector(): void

  /**
   * User available
   */
  abstract get babylon(): Pick<BabylonAccessor, 'scene'>
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)
  abstract get loaded(): boolean
  abstract get started(): boolean
  abstract get state(): SceneStateInterface | null
  abstract get spawn(): SceneSpawn
  abstract get remove(): SceneRemove
  abstract start(state?: SceneStateConstructor, stateSetup?: any): SceneStateInterface | null
  abstract stop(): void
  abstract load(): LoadingProgress
  abstract unload(): void
  abstract switchCamera(camera: CameraConstructor, setup: any): void
  abstract getCamera<C extends CameraInterface = CameraInterface>(): C
  abstract switchState(state: SceneStateConstructor, setup: any): void
  abstract getActionOwner(actionConstructor: SceneActionConstructor): SceneInterface | SceneStateInterface | undefined
  abstract playAction(action: SceneActionConstructor | ((delta: number) => void), setup: any): void
  abstract stopAction(action: SceneActionConstructor): void
  abstract playActionGroup(group: FlexId): void
  abstract stopActionGroup(group: FlexId): void
  abstract stopActionAll(): void
  abstract removeAction(actionConstructor: SceneActionConstructor, forceRemove?: boolean): void
  abstract removeActionGroup(group: FlexId, forceRemove?: boolean): void
  abstract removeActionAll(forceRemove?: boolean): void
  abstract getAction(actionConstructor: SceneActionConstructor): SceneActionInterface | undefined
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
