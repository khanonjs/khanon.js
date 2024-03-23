import { Observable } from '@babylonjs/core'
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture'
import { Scene as BabylonScene } from '@babylonjs/core/scene'

import {
  ActorConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  SceneConstructor,
  StateConstructor
} from './constructors'
import { SpriteConstructor } from './constructors/sprite-constructor'
import { Actor2DProps } from './decorators/actor/actor2d/actor2d-props'
import { Actor3DProps } from './decorators/actor/actor3d/actor3d-props'
import { AppProps } from './decorators/app/app-props'
import { SceneProps } from './decorators/scene/scene-props'
import { SpriteProps } from './decorators/sprite/sprite-props'
import { SpriteTexture } from './decorators/sprite/sprite-texture'
import {
  BabylonContainer,
  LoadingProgress
} from './models'

// **************
//  Constructors
// **************
export * from './constructors'

// **************
// App decorator
// **************
export declare function App(props: AppProps): any
export { AppProps } from './decorators/app/app-props'
export declare abstract class AppInterface {
  /**
   * Entry point of the application.
   * Called after the application has been properly configured and started.
   * At this point, the first scene and/or GUI should be started.
   */
  abstract onStart(): void

  /**
   * Called on browser tab closed (Optional).
   * Release any app resource.
   * The application progress should be saved at this point.
   */
  onClose?(): void

  /**
   * Called on any app error.
   * App errors are critical and the application is closed at this point.
   */
  onError?(error?: any): void
}

// ****************
// Scene decorator
// ****************
export declare function Scene(props: SceneProps): any
export { SceneProps } from './decorators/scene/scene-props'
export declare abstract class SceneInterface {
  /**
   * Babylon container
   */
  babylon: Pick<BabylonContainer, 'engine' | 'scene'>

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
  load(): LoadingProgress

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

// ****************
// Actor decorator
// ****************
export declare abstract class ActorInterface {

}

export declare function Actor2D(props: Actor2DProps): any
export { Actor2DProps } from './decorators/actor/actor2d/actor2d-props'
export declare abstract class Actor2DInterface extends ActorInterface {

}

export declare function Actor3D(props: Actor3DProps): any
export { Actor3DProps } from './decorators/actor/actor3d/actor3d-props'
export declare abstract class Actor3DInterface extends ActorInterface {

}

// ****************
// Sprite decorator
// ****************
export declare function Sprite(props: SpriteProps): any
export { SpriteProps } from './decorators/sprite/sprite-props'
export declare abstract class SpriteInterface {
  /**
   * Babylon container
   */
  babylon: Pick<BabylonContainer, 'sprite'>

  /**
   * Used to assign a DynamicTexture to the Sprite.
   * This method is called in case Sprite property 'toDynamicTexture' is true.
   */
  fromDynamicTexture?(texture?: DynamicTexture): DynamicTexture
}

// *********
// Khanonjs
// *********
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
    function unload(scene: SceneConstructor): void
    function unload(scene: SceneConstructor[]): void
    function start(): void
    function stop(): void
  }

  export namespace Sprite {
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
