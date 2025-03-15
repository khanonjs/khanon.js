import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import {
  BabylonAccessor,
  Rect,
  Timeout
} from '../../models'
import {
  FlexId,
  SceneConfiguration
} from '../../types'
import {
  ActorConstructor,
  ActorInterface
} from '../actor'
import {
  CameraConstructor,
  CameraInterface
} from '../camera'
import {
  GUIConstructor,
  GUIInterface
} from '../gui'
import {
  MeshConstructor,
  MeshInterface
} from '../mesh'
import { MeshMapConstructor } from '../mesh-map'
import {
  ParticleConstructor,
  ParticleInterface
} from '../particle'
import {
  SpriteConstructor,
  SpriteInterface
} from '../sprite'
import { SpriteMapConstructor } from '../sprite-map'
import {
  SceneActionConstructor,
  SceneActionInterface
} from './scene-action'
import {
  SceneStateConstructor,
  SceneStateInterface
} from './scene-state'

export declare class SceneSpawn {
  /**
   * Spawns an actor in the scene.
   * @param actor
   * @returns
   */
  actor<A extends ActorInterface<any>, C extends undefined | number = undefined>(actor: new () => A, counter?: C, alternativeOnSpawn?: (actor: A, index: number) => void): undefined extends C ? A : A[]

  /**
   * Spawns a particle in the scene.
   * @param particle
   */
  particle<P extends ParticleConstructor>(Particle: P | ((particle: InstanceType<P>) => void), setup: InstanceType<P>['setup'], offset?: BABYLON.Vector3): InstanceType<P>

  /**
   * Spawns a sprite in the scene.
   * @param sprite
   */
  sprite<S extends SpriteInterface, C extends undefined | number = undefined>(sprite: new () => S, counter?: C, alternativeOnSpawn?: (sprite: S, index: number) => void): undefined extends C ? S : S[]

  /**
   * Spawns a mesh in the scene.
   * @param mesh
   */
  mesh<M extends MeshInterface, C extends undefined | number = undefined>(mesh: new () => M, counter?: C, alternativeOnSpawn?: (mesh: M, index: number) => void): undefined extends C ? M : M[]
}

export declare class SceneRemove {
  /**
   * Removes an actor from the scene.
   * @param actor
   */
  actor(actor: ActorInterface<any> | ActorInterface<any>[]): void

  /**
   * Removes all actors from the scene.
   */
  actorAll(): void

  /**
   * Removes a particle from the scene.
   * @param particle
   */
  particle(particle: ParticleInterface | ParticleInterface[]): void

  /**
   * Removes all particles from the scene.
   */
  particleAll(): void

  /**
   * Removes a sprite from the scene.
   * @param sprite
   */
  sprite(sprite: SpriteInterface | SpriteInterface[]): void

  /**
   * Removes all sprites from the scene.
   */
  spriteAll(): void

  /**
   * Removes a mesh from the scene.
   * @param mesh
   */
  mesh(mesh: MeshInterface | MeshInterface[]): void

  /**
   * Removes all meshes from the scene.
   */
  meshAll(): void

  /**
   * Removes all elements from the scene.
   * @param mesh
   */
  all(): void
}

export declare abstract class SceneInterface {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'scene'>

  /**
   * Indicates if the scene has been loaded.
   */
  get loaded(): boolean

  /**
   * Indicates if the scene is started and is currently running.
   */
  get started(): boolean

  /**
   * Current state.
   */
  get state(): SceneStateInterface | null

  /**
   * Scene spawn class.
   */
  get spawn(): SceneSpawn

  /**
   * Scene remove class.
   */
  get remove(): SceneRemove

  /**
   * Turns on/off the 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Returns the name of the class.
   */
  getClassName(): string

  /**
   * Sets a timeout.
   * This interval relies on the app loopUpdate and it will be triggered on correct frame.
   * It will be removed on context remove.
   * @param func Callback
   * @param ms Milliseconds
   */
  setTimeout(func: () => void, ms: number, context?: any): Timeout

  /**
   * Sets an interval.
   * This interval relies on the app loopUpdate and it will be triggered on correct frame.
   * It will be removed on context remove.
   * @param func Callback
   * @param ms Milliseconds
   */
  setInterval(func: () => void, ms: number): Timeout

  /**
   * Clears a timeout in this context.
   * @param timeout
   */
  clearTimeout(timeout: Timeout): void

  /**
   * Clears an interval in this context.
   * @param timeout
   */
  clearInterval(timeout: Timeout): void

  /**
   * Clear all timeouts and intervals in this context.
   */
  clearAllTimeouts(): void

  /**
   * Start the scene.
   * @param state Initial state.
   */
  start<S extends SceneStateConstructor>(state: S, stateSetup: InstanceType<S>['setup']): SceneStateInterface

  /**
   * Stop the scene.
   */
  stop(): void

  /**
   * Load the scene's assets.
   */
  load(): LoadingProgress

  /**
   * Unload assets.
   */
  unload(): void

  /**
   * Shows a GUI. This GUI must have been declared in the decorator props.
   * @param gui
   * @param setup
   */
  showGUI<G extends GUIInterface, H extends GUIConstructor>(gui: H, setup: InstanceType<H>['setup']): G

  /**
   * Hides a GUI.
   * @param gui
   */
  hideGUI(gui: GUIConstructor): void

  /**
   * Gets a GUI that's being shown.
   * @param gui
   */
  getGUI<G extends GUIInterface>(gui: GUIConstructor): G | undefined

  /**
   * Sets a camera.
   * @param camera
   * @param setup
   */
  switchCamera<C extends CameraConstructor>(camera: C, setup: InstanceType<C>['setup']): void // TODO is it possible to make 'setup' argument optional whether InstanceType<S>['setup'] type is 'any'?

  /**
   * Gets the camera. Use the generic 'C' to set the returning camera type.
   */
  getCamera<C extends CameraInterface = CameraInterface>(): C

  /**
   * Set the state.
   * @param state
   */
  switchState<S extends SceneStateConstructor>(state: S, setup: InstanceType<S>['setup']): void // TODO is it possible to make 'setup' argument optional whether InstanceType<S>['setup'] type is 'any'?

  /**
   * Plays an Action. N actions can be played simultaneously.
   * @param action
   */
  playAction<S extends SceneActionConstructor>(action: S | ((delta: number) => void), setup: InstanceType<S>['setup']): InstanceType<S> // TODO is it possible to make 'setup' argument optional whether InstanceType<S>['setup'] type is 'any'?

  /**
   * Plays all actions of a group that have been previously stopped.
   * @param group
   */
  playActionGroup(group: FlexId): void

  /**
   * Stops an action. If the actions prop 'preserve' prop is 'false', it will be removed.
   * Actions can be stopped also within the Action itself.
   * @param action
   */
  stopAction(action: SceneActionConstructor | ((delta: number) => void)): void

  /**
   * Stops all actions of a group. All the actions with 'preserve' prop as 'false' will be removed.
   * @param group
   */
  stopActionGroup(group: FlexId): void

  /**
   * Stops all actions. All the actions with 'preserve' prop as 'false' will be removed.
   */
  stopActionAll(): void

  /**
   * Stops and removes an action.
   */
  removeAction(actionConstructor: SceneActionConstructor): void

  /**
   * Stops and removes all actions of a group.
   * @param group
   */
  removeActionGroup(group: FlexId): void

  /**
   * Stops and removes all actions.
   */
  removeActionAll(): void

  /**
   * Gets an action.
   * @param actionConstructor
   */
  getAction(actionConstructor: SceneActionConstructor): SceneActionInterface | undefined

  /**
   * Notifies a message to this scene.
   */
  notify(message: FlexId, ...args: any[]): void

  /**
   * Callback invoked before the scene has been started.
   */
  onStart?(): void

  /**
   * Callback called after the scene has been stopped.
   */
  onStop?(): void

  /**
   * Callback invoked on scene load.
   * @param progress Loading Progress.
   */
  onLoaded?(progress: LoadingProgress): void

  /**
   * Callback invoked on scene unload.
   */
  onUnload?(): void

  /**
   * Callback invoked on loop update.
   * @param delta Time differential since last frame.
   */
  onLoopUpdate?(delta: number): void

  /**
   * Callback invoked on canvas resize.
   * @param canvasSize Canvas Size ('x' and 'y' are 0 any case).
   */
  onCanvasResize?(size: Rect): void
}

export type SceneConstructor = new () => SceneInterface
export type SceneMapConstructor = SpriteMapConstructor | MeshMapConstructor

export interface SceneProps {
  /**
   * URL of the scene to load from a '.babylon' file.
   * If undefined, no assets will be loaded, all the scene assets will be manually created.
   */
  url?: string

  /**
   * Refers to BABYLON.SceneOptions: https://doc.babylonjs.com/typedoc/interfaces/BABYLON.SceneOptions
   */
  options?: BABYLON.SceneOptions

  /**
   * Babylon Scene accessors to configure the scene.
   */
  configuration?: SceneConfiguration

  /**
   * States to use in this scene.
   */
  states?: SceneStateConstructor[]

  /**
   * Actions to use in this scene.
   */
  actions?: SceneActionConstructor[]

  /**
   * Cameras to use in this scene.
   */
  cameras?: CameraConstructor[]

  /**
   * GUIs to use in this scene.
   */
  guis?: GUIConstructor[]

  /**
   * Maps to use in this scene.
   * Work in progress, this feature will be implemented further.
   */
  maps?: SceneMapConstructor[]

  /**
   * Actors that will be spawned in this scene.
   */
  actors?: ActorConstructor[]

  /**
   * Sprites to use in this scene.
   */
  sprites?: SpriteConstructor[]

  /**
   * Meshes to use in this Scene.
   */
  meshes?: MeshConstructor[]

  /**
   * Particles to use in this scene.
   */
  particles?: ParticleConstructor[]

  /**
   * By default 'true'.
   * Use the Babylon debug inspector in this scene.
   */
  useDebugInspector?: boolean
}

export declare function Scene(props?: SceneProps): any
