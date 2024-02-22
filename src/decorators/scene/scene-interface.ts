import { Scene as BabylonJsScene } from '@babylonjs/core/scene'

import { ObservablesContainer } from '../../_OLD-models/observables-container'
import { ActorConstructor } from '../actor/actor-constructor'
import { ParticleSourceConstructor } from '../particle-source/particle-source-constructor'
import { ParticleConstructor } from '../particle/particle-constructor'
import { StateConstructor } from '../state/state-constructor'

export declare abstract class SceneInterface {
  /**
   * Babylon.js scene instance.
   */
  babylonjs: BabylonJsScene

  /**
   * Indicates if the scene has been loaded.
   */
  loaded: boolean

  /**
   * Indicates if the scene is started and is currently running.
   */
  started: boolean

  /**
   * Observables container.
   */
  observables: ObservablesContainer

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
   * Spawn an Actor, Particle, or Particle Source.
   * @param entity
   */
  spawn(entity: ActorConstructor | ParticleConstructor | ParticleSourceConstructor): void

  /**
   * Callback called before the scene has been started.
   */
  protected onStart?(): void

  /**
   * Callback called after the scene has been stopped.
   */
  protected onStop?(): void

  /**
   * Callback before after the scene has been loaded.
   */
  protected onLoad?(): void

  /**
   * Callback called after the scene has been unloaded.
   */
  protected onUnload?(): void

  /**
   * Callback called on scene error. This error could happen at any point of the scene lifetime.
   */
  protected abstract onError?(errorMsg: string): void
}
