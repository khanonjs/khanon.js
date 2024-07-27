import { LoadingProgress } from '../../base'
import { SceneActionConstructor } from '../../constructors/scene-action-constructor'
import { SceneStateConstructor } from '../../constructors/scene-state-constructor'
import {
  BabylonAccessor,
  Rect
} from '../../models'
import { FlexId } from '../../types'
import { ActorInterface } from '../actor'
import { MeshInterface } from '../mesh'
import { ParticleSourceInterface } from '../particle-source/particle-source-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteInterface } from '../sprite'
import { SceneProps } from './scene-props'
import { SceneStateInterface } from './scene-state'

export { SceneProps } from './decorators/scene/scene-props'
export declare function Scene(props: SceneProps): any

export declare class SceneSpawn {
  /**
   * Spawns an actor in the scene.
   * @param actor
   * @returns
   */
  actor<A extends ActorInterface>(actor: new () => A): A

  /**
   * Spawns a particle in the scene.
   * @param particle
   */
  particle<P extends (ParticleInterface | ParticleSourceInterface)>(particle: new () => P): P

  /**
   * Spawns a sprite in the scene.
   * @param sprite
   */
  sprite<S extends SpriteInterface>(sprite: new () => S): S

  /**
   * Spawns a mesh in the scene.
   * @param mesh
   */
  mesh<M extends MeshInterface>(mesh: new () => M): M
}

export declare class SceneRemove {
  /**
   * Removes an actor from the scene.
   * @param actor
   */
  actor(actor: ActorInterface): void

  /**
   * Removes all actors from the scene.
   */
  actorAll(): void

  /**
   * Removes a particle from the scene.
   * @param particle
   */
  particle(particle: ParticleInterface | ParticleSourceInterface): void

  /**
   * Removes all particles from the scene.
   */
  particleAll(): void

  /**
   * Removes a sprite from the scene.
   * @param sprite
   */
  sprite(sprite: SpriteInterface): void

  /**
   * Removes all sprites from the scene.
   */
  spriteAll(): void

  /**
   * Removes a mesh from the scene.
   * @param mesh
   */
  mesh(mesh: MeshInterface): void

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
   * Babylon container
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
  get state(): SceneStateInterface

  /**
   * Scene spawn methods.
   */
  get spawn(): SceneSpawn

  /**
   * Scene remove methods.
   */
  get remove(): SceneRemove

  /**
   * Turns On/Off 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

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
   * Set the state.
   * @param state
   */
  startState<S extends SceneStateConstructor>(state: S, setup: InstanceType<S>['setup']): void // TODO is it possible to make 'setup' argument optional whether InstanceType<S>['setup'] type is 'any'?

  /**
   * Plays an Action. N actions can be played simultaneously.
   * @param action
   */
  playAction<S extends SceneActionConstructor>(action: S | ((delta: number) => void), setup: InstanceType<S>['setup']): void // TODO is it possible to make 'setup' argument optional whether InstanceType<S>['setup'] type is 'any'?

  /**
   * Stops an action. Actions can be stopped also within the Action itself.
   * @param action
   */
  stopAction(action: SceneActionConstructor | ((delta: number) => void)): void

  /**
   * Stops all actions of a group.
   * @param group
   */
  stopActionGroup(group: number): void

  /**
   * Stops all actions.
   */
  stopActionAll(): void

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
  onLoad?(progress: LoadingProgress): void

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
