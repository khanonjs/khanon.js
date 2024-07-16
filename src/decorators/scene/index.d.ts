import { LoadingProgress } from '../../base'
import { SceneStateConstructor } from '../../constructors/scene-state-constructor'
import {
  BabylonAccessor,
  Rect
} from '../../models'
import { ActorInterface } from '../actor'
import { MeshInterface } from '../mesh'
import { ParticleSourceInterface } from '../particle-source/particle-source-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteInterface } from '../sprite'
import { SceneProps } from './scene-props'
import {
  SceneStateInterface,
  SceneStateOptions
} from './scene-state'

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
  particle<P extends ParticleInterface>(particle: new () => P): P

  /**
   * Spawns a particle source in the scene.
   * @param particleSource
   */
  particleSource<S extends ParticleSourceInterface>(particleSource: new () => S): S

  /**
   * Spawns a mesh in the scene.
   * @param mesh
   */
  mesh<M extends MeshInterface>(mesh: new () => M): M

  /**
   * Spawns a sprite in the scene.
   * @param sprite
   */
  sprite<S extends SpriteInterface>(sprite: new () => S): S

  /**
   * Remove all spawned elements of this scene.
   */
  clear(): void
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
   * Turns On/Off 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Start the scene.
   * @param state Initial state.
   */
  start(state: SceneStateConstructor): SceneStateInterface

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
  startState<S extends SceneStateConstructor>(state: S): SceneStateOptions<InstanceType<S>['setup']>

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
