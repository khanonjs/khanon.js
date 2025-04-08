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
import { TimersByContext } from '../../base/interfaces/timers-by-context'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { FlexId } from '../../types/flex-id'
import { ActorConstructor } from '../actor/actor-constructor'
import { ActorInterface } from '../actor/actor-interface'
import { CameraConstructor } from '../camera/camera-constructor'
import { CameraInterface } from '../camera/camera-interface'
import { GUIConstructor } from '../gui/gui-constructor'
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

export abstract class SceneInterface implements Loadable, LoopUpdatable, CanvasResizable, Notificable, TimersByContext {
  abstract _props: SceneProps
  abstract _assets: AssetDefinition[]
  abstract _loaded: boolean
  abstract _loadingProgress: LoadingProgress | undefined
  abstract _started: boolean
  abstract _state: SceneStateInterface | null
  abstract _spawn: SceneSpawn
  abstract _remove: SceneRemove
  abstract _camera: CameraInterface | undefined
  abstract _cameraConstructor: CameraConstructor
  abstract _cameraSetup: any
  abstract _loopUpdate: boolean
  abstract _debugInspector: (event: KeyboardEvent) => void
  abstract _availableElements: SceneAvailableElements
  abstract _metadata: Metadata
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract _animationHandler: Map<SpriteInterface, () => void>
  abstract _actions: Map<SceneActionConstructor, SceneActionInterface>
  abstract _actors: Set<ActorInterface>
  abstract _actorsByType: Map<ActorConstructor, ActorInterface[]>
  abstract _meshes: Set<MeshInterface>
  abstract _sprites: Set<SpriteInterface>
  abstract _particles: Set<ParticleInterface>
  abstract _guis: Map<GUIConstructor, GUIInterface>
  abstract _load(): LoadingProgress
  abstract _unload(): void
  abstract _releaseGUIs(): void
  abstract _setEngineParams(): void // TODO ?
  abstract _playActionFromInstance(instance: SceneActionInterface): void
  abstract _stopActionFromInstance(instance: SceneActionInterface, forceRemove?: boolean): void
  abstract _setAnimationHandler(sprite: SpriteInterface, animation: SpriteAnimation): void
  abstract _stopAnimationHandler(sprite: SpriteInterface): void
  abstract _getActionOwner(actionConstructor: SceneActionConstructor): SceneInterface | SceneStateInterface | undefined
  abstract _startRenderObservable(): void
  abstract _stopRenderObservable(): void
  abstract _useDebugInspector(): void
  abstract _denyDebugInspector(): void

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
  abstract getClassName(): string
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(timeout: Timeout): void
  abstract clearAllTimeouts(): void
  abstract start(state?: SceneStateConstructor, stateSetup?: any): SceneStateInterface | null
  abstract stop(): void
  abstract showGUI<G extends GUIInterface>(gui: GUIConstructor, setup: any): G
  abstract hideGUI(gui: GUIConstructor): void
  abstract getGUI<G extends GUIInterface>(gui: GUIConstructor): G | undefined
  abstract switchCamera(camera: CameraConstructor, setup: any): void
  abstract getCamera<C extends CameraInterface = CameraInterface>(): C
  abstract switchState(state: SceneStateConstructor, setup: any): void
  abstract isState(state: SceneStateConstructor): boolean
  abstract playAction(action: SceneActionConstructor | ((delta: number) => void), setup: any): void
  abstract stopAction(action: SceneActionConstructor): void
  abstract playActionGroup(group: FlexId): void
  abstract stopActionGroup(group: FlexId): void
  abstract stopActionAll(): void
  abstract removeAction(actionConstructor: SceneActionConstructor, forceRemove?: boolean): void
  abstract removeActionGroup(group: FlexId, forceRemove?: boolean): void
  abstract removeActionAll(forceRemove?: boolean): void
  abstract getActors<C extends ActorConstructor>(actor: C): InstanceType<C>[]
  abstract getAction<C extends SceneActionConstructor>(actionConstructor: C): InstanceType<C> | undefined
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
