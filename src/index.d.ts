import {
  Camera as BabylonCamera,
  Scene as BabylonScene
} from '@babylonjs/core'

import { LoadingProgress } from './base'
import {
  ActorConstructor,
  CameraConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  SceneConstructor,
  SceneStateConstructor
} from './constructors'
import { ActorCompositionDefinition } from './decorators/actor/actor-composition/actor-composition-definition'
import { ActorProps } from './decorators/actor/actor-props'
import { Actor2DProps } from './decorators/actor/actor2d/actor2d-props'
import { Actor3DProps } from './decorators/actor/actor3d/actor3d-props'
import { AppProps } from './decorators/app/app-props'
import { SceneStateProps } from './decorators/scene-state/scene-state-props'
import { SceneProps } from './decorators/scene/scene-props'
import { SceneType } from './decorators/scene/scene-type'
import { SpriteProps } from './decorators/sprite/sprite-props'
import { BabylonAccessor } from './models'

// ********************
//  Babylon.js objects
// ********************
export { BabylonScene }

// **************
//  Models
// **************
export { UseCamera } from './models/use-camera'

// **************
//  Constructors
// **************
export * from './constructors'

// *********
// Khanonjs
// *********
export declare namespace KJS {
  /**
   * Throws critical error and stops the application.
   * @param error
   */
  function throw_(error?: any): void;
  export { throw_ as throw } // Cheat function name :)

  /**
   * Clears cache.
   */
  export function clearCache(): void

  // Types
  export type Actor = ActorInterface;
  export type Scene = SceneInterface;

  /**
   * Scene controller
   */
  export namespace Scene {
    function load(scene: SceneConstructor): LoadingProgress
    function load(scene: SceneConstructor[]): LoadingProgress
    function unload(scene: SceneConstructor): void
    function unload(scene: SceneConstructor[]): void
    function start(scene: SceneConstructor, state: SceneStateConstructor): void
    function stop(scene: SceneConstructor): void
  }

  export namespace Sprite {
  }
}

// **************
// App decorator
// **************
export { AppProps } from './decorators/app/app-props'
export declare function App(props: AppProps): any
export declare abstract class AppInterface {
  /**
   * Entry point of the application.
   * Called after the application has been properly configured and started.
   * At this point, the first scene and/or GUI should be started.
   */
  abstract onStart(): void

  /**
   * Callback invoked on app error. This error could happen at any point of the app lifetime and is critical, it will stop the application.
   */
  abstract onError(error?: any): void

  /**
   * Called on browser tab closed (Optional).
   * Release any app resource.
   * The application progress should be saved at this point.
   */
  onClose?(): void
}

// ****************
// Scene decorator
// ****************
export { SceneType } from './decorators/scene/scene-type'
export { SceneProps } from './decorators/scene/scene-props'
export declare function Scene(props: SceneProps): any
export declare abstract class SceneInterface {
  /**
   * Babylon container
   */
  babylon: Pick<BabylonAccessor, 'engine' | 'scene'>

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
  start(state: SceneStateConstructor): void

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
  setState(state: SceneStateConstructor): void

  /**
   * Spawns an Actor.
   * @param actor
   */
  spawnActor(actor: ActorConstructor, initialize?: (item: ActorInterface) => void): void

  /**
   * Spawns a Particle.
   * @param actor
   */
  spawnParticle(particle: ParticleConstructor, initialize?: (particle: ParticleConstructor) => void): void

  /**
   * Spawns a Particle Source.
   * @param actor
   */
  spawnParticleSource(particleSource: ParticleSourceConstructor, initialize?: (particleSource: ParticleSourceConstructor) => void): void

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
}

// ****************
// Actor decorator
// ****************
export declare function ActorComposition(id: string)
export { ActorCompositionDefinition } from './decorators/actor/actor-composition/actor-composition-definition'

export { ActorProps } from './decorators/actor/actor-props'
export declare function Actor(props?: ActorProps = {}): any
export declare abstract class ActorInterface {
  /**
   * Current composition in use
   */
  composition: ActorCompositionDefinition

  /**
   * Use a previously defined composition within the Actor class using ActorComposition decorator
   * @param id Composition Id
   * @param CompositionDefinition User custom composition definition
   */
  useComposition<C extends ActorCompositionDefinition>(id: string, CompositionDefinition?: new (id: string) => C): C

  /**
   * Callback invoked after the actor has been spawned on a scene
   */
  onSpawn?(): void
}

// ****************
// Sprite decorator
// ****************
export { SpriteProps } from './decorators/sprite/sprite-props'
export declare function Sprite(props: SpriteProps): any
export declare abstract class SpriteInterface {
  /**
   * Babylon.js objects used by this class.
   */
  babylon: Pick<BabylonAccessor, 'spriteManager' | 'scene'>

  /**
   * Callback invoked after the sprite has been loaded in a scene.
   */
  onLoaded?(scene: KJS.Scene): void

  spawn(): void // 8a8f esto sobra?
}

// ****************
// Camera decorator
// ****************
export declare function Camera(): any
export declare abstract class CameraInterface {
  babylon: Pick<BabylonAccessor<ReturnType<this['initialize']>>, 'camera'>

  /**
   * Initialize the camera. This method must return a valid Babylon camera.
   * It will be used from any Scene State requiring it.
   */
  abstract initialize(scene: BabylonScene): BabylonCamera

  /**
   * LoopUpdate method.
   */
  loopUpdate?(delta: number): void
}

// ****************
// State decorator
// ****************
export { SceneStateProps } from './decorators/scene-state/scene-state-props'
export declare function SceneState(props: SceneStateProps): any
export declare abstract class SceneStateInterface {
  /**
   * Babylon.js objects
   */
  babylon: Pick<BabylonAccessor, 'scene'>

  /**
   * Owner scene of this state
   */
  scene: SceneType

  /**
   * Sets a camera. Use this method at any point or event of the state lifecycle.
   */
  setCamera(camera: CameraConstructor): void

  /**
   * Invoked on state start. Use this method to setup the scene according to this state start.
   */
  onPlay?(scene: SceneType): void

  /**
   * Invoked on state end. Use this method to setup the scene according to this state end.
   */
  onEnd?(): void

  /**
   * LoopUpdate method.
   */
  loopUpdate?(delta: number): void
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
