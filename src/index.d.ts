import { Observable } from '@babylonjs/core'
import { Scene as BabylonScene } from '@babylonjs/core/scene'

import {
  ActorConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  SceneConstructor,
  StateConstructor
} from './constructors'
import { AppProps } from './decorators/app/app-props'
import { SceneProps } from './decorators/scene/scene-props'
import { LoadingProgress } from './models'

// **************
//  Constructors
// **************
export * from './constructors'

// **************
// App decorator
// **************
export declare function App(props: AppProps): any
export { AppProps } from './decorators/app/app-props'
export { AppInterface } from './decorators/app/app-interface'

// ****************
// Scene decorator
// ****************
export declare function Scene(props: SceneProps): any
export { SceneProps } from './decorators/scene/scene-props'
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
  onStart?(): void

  /**
   * Callback called after the scene has been stopped.
   */
  onStop?(): void

  /**
   * Callback invoked on scene load.
   */
  onLoad?(progress: LoadingProgress): void

  /**
   * Callback invoked on scene unload.
   */
  onUnload?(): void

  /**
   * Callback invoked on scene error. This error could happen at any point of the scene lifetime.
   */
  onError?(errorMsg: string): void
}

// ********************
// Khanonjs controller
// ********************
export declare namespace KJS {
  /**
   * Throws critical error and stops the application.
   * @param error
   */
  function throw_(error?: any): void

  /**
   * Clears cache.
   */
  function clearCache(): void

  /**
   * Scene controller
   */
  export namespace Scene {
    function load(scene: SceneConstructor): LoadingProgress
    function load(scene: SceneConstructor[]): LoadingProgress
    function unload(): void
    function start(): void
    function stop(): void
  }
}

// ********
// Modules
// ********
export { Logger } from './modules/logger/logger'
export { LoggerLevels } from './modules/logger/logger-levels'

/* export { Scene } from './decorators/scene/scene-decorator'
export { SceneInterface } from './decorators/scene/scene-interface'
// export { SceneConfiguration } from './decorators/scene/scene-configuration'

declare enum ETransitionEffect {
  FADE
}

interface TransitionEffect {
  effect: ETransitionEffect
  factor: number
} */

/* export declare namespace KJS {
  export type SceneInterface = string

  export function clearCache(): void

  export namespace Scene { // ControllerScene class
    function load(scene: SceneConstructor): Observable<LoadingProgress>
    function unload(scene: SceneConstructor): void
    function start(scene: SceneConstructor, effect: TransitionEffect): void
    function stop(scene: SceneConstructor, effect: TransitionEffect): void
  }

  export namespace GUI { // ControllerGUI class
    function load(gui: GUIConstructor): Observable<LoadingProgress>
    function unload(gui: GUIConstructor): void
    function show(gui: GUIConstructor): void
    function hide(gui: GUIConstructor): void
  }
} */
