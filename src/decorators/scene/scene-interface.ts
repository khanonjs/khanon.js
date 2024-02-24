import { Scene as BabylonScene } from '@babylonjs/core/scene'

import { ActorConstructor } from '../../constructors/actor-constructor'
import { ParticleConstructor } from '../../constructors/particle-constructor'
import { ParticleSourceConstructor } from '../../constructors/particle-source-constructor'
import { StateConstructor } from '../../constructors/state-constructor'
import { LoadingProgress } from '../../models/loading-progress'

export declare abstract class SceneInterface {
  /**
   * Babylon.js scene instance.
   */
  babylon: BabylonScene

  /**
   * Indicates if the scene has been loaded.
   */
  loaded: boolean

  /**
   * Indicates if the scene is started and is currently running.
   */
  started: boolean

  /**
   * Start the scene.
   * @param state Initial state.
   */
  start(state: StateConstructor): void

  /**
   * Stop the scene.
   */
  stop(): void

  /**
   * Load the scene's assets.
   */
  load(): void

  /**
   * Unload assets.
   */
  unload(): void

  /**
   * Set the state.
   * @param state
   */
  setState(state: StateConstructor): void

  /**
   * Spawns an Actor, Particle, or Particle Source.
   * @param entity
   */
  spawn(entity: ActorConstructor | ParticleConstructor | ParticleSourceConstructor): void

  /**
   * Callback invoked before the scene has been started.
   */
  protected onStart?(): void

  /**
   * Callback called after the scene has been stopped.
   */
  protected onStop?(): void

  /**
   * Callback invoked on scene load.
   */
  protected onLoad?(progress: LoadingProgress): void

  /**
   * Callback invoked on scene unload.
   */
  protected onUnload?(): void

  /**
   * Callback invoked on scene error. This error could happen at any point of the scene lifetime.
   */
  protected onError?(errorMsg: string): void
}
