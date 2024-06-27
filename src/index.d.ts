import {
  Camera as BabylonCamera,
  Matrix,
  Mesh as BabylonMesh,
  Scene as BabylonScene,
  Sprite as BabylonSprite,
  Vector3
} from '@babylonjs/core'

import { LoadingProgress } from './base'
import { DisplayObject } from './base/classes/display-object'
import {
  CameraConstructor,
  MeshConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  SceneConstructor,
  SceneStateConstructor,
  SpriteConstructor
} from './constructors'
import { ActorProps } from './decorators/actor/actor-props'
import { AppProps } from './decorators/app/app-props'
import { MeshAnimation } from './decorators/mesh/mesh-animation'
import { MeshProps } from './decorators/mesh/mesh-props'
import { ParticleSourceInterface } from './decorators/particle-source/particle-source-interface'
import { ParticleInterface } from './decorators/particle/particle-interface'
import { SceneStateProps } from './decorators/scene-state/scene-state-props'
import { SceneProps } from './decorators/scene/scene-props'
import { SceneType } from './decorators/scene/scene-type'
import { SpriteAnimation } from './decorators/sprite/sprite-animation'
import { SpriteProps } from './decorators/sprite/sprite-props'
import {
  BabylonAccessor,
  Rect
} from './models'
import {
  MeshTransform,
  SpriteTransform
} from './types'

// ****************************
//  Babylon.js renamed objects
// ****************************
export { BabylonCamera }
export { BabylonMesh }
export { BabylonScene }
export { BabylonSprite }

// **************
//  Models
// **************
export { Rect } from './models/rect'
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
// Sprite decorator
// ****************
export { SpriteProps } from './decorators/sprite/sprite-props'
export { SpriteAnimation } from './decorators/sprite/sprite-animation'
export declare function Sprite(props: SpriteProps): any
export declare abstract class SpriteInterface {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'scene' | 'spriteManager' | 'sprite'>

  /**
   * Scene this Sprite belongs to.
   */
  get scene(): SceneType

  /**
   * Shortcut to basic transform methods and accessors.
   * Using this object is the same than accesing it through 'this.babylon.sprite'
   */
  get transform(): SpriteTransform

  /**
   * Callback invoked after the sprite has been spawned in a scene.
   */
  onSpawn?(scene: KJS.Scene): void

  /**
   * Sets a sprite manually.
   * Through this method, it is possible to manually create a Babylon Sprite in 'onSpawn' method and apply it.
   * @param babylonMesh
   */
  setSprite(babylonSprite: BabylonSprite): void

  /**
   * Sets the transform (translation, rotation and scale).
   * @param transform
   */
  setTransform(transform: Matrix): void

  /**
   * Gets teh transform.
   * @param transform
   */
  getTransform(): Matrix

  /**
   * Plays an animation. Animations are defined in the Sprite decorator 'props' or manually using 'MeshAnimation' interface.
   * @param animation
   * @param loopOverride
   * @param completed
   */
  playAnimation(animation: SpriteAnimation, loopOverride?: boolean, completed?: () => void): void

  /**
   * Stops current animation.
   */
  stopAnimation(): void
}

// ****************
// Mesh decorator
// ****************
export { MeshProps } from './decorators/mesh/mesh-props'
export { MeshAnimation } from './decorators/mesh/mesh-animation'
export declare function Mesh(props?: MeshProps): any
export declare abstract class MeshInterface implements DisplayObject {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'scene' | 'mesh'>

  /**
   * Scene this Mesh belongs to.
   */
  get scene(): SceneType

  /**
   * Shortcut to basic transform methods and accessors.
   * Using this object is the same than accesing it through 'this.babylon.mesh'.
   */
  get transform(): MeshTransform

  /**
   * Callback invoked after the mesh has been spawned in a scene.
   */
  onSpawn?(scene: KJS.Scene): void

  /**
   * Sets a mesh manually.
   * Through this method, it is possible to manually create a Babylon Mesh in 'onSpawn' method and apply it.
   * @param babylonMesh
   */
  setMesh(babylonMesh: BabylonMesh): void

  /**
   * Sets the transform (translation, rotation and scale).
   * @param transform
   */
  setTransform(transform: Matrix): void

  /**
   * Gets the transform.
   * @param transform
   */
  getTransform(): Matrix

  /**
   * Plays an animation. Animations are defined in the Mesh decorator 'props' or manually using 'MeshAnimation' interface.
   * @param animation
   * @param loopOverride
   * @param completed
   */
  playAnimation(animation: MeshAnimation, loopOverride?: boolean, completed?: () => void): void

  /**
   * Stops current animation.
   */
  stopAnimation(): void
}

// ****************
// Actor decorator
// ****************
export { ActorProps } from './decorators/actor/actor-props'
export declare function Actor(props?: ActorProps): any
export declare class ActorComposition<B extends SpriteInterface | MeshInterface> {
  get body(): B

  /**
   * Sets the Body of the Actor.
   * Setting a new Body removes any previously added Node.
   * @param Node
   * @returns
   */
  setBody<N extends SpriteInterface | MeshInterface>(Node: new () => N): N

  /**
   * Adds a Node hooked to the actor's body.
   * @param Node
   * @param name
   * @returns
   */
  addNode<N extends SpriteConstructor | MeshConstructor>(Node: N, name: string): B

  /**
   * Gets a Node by name.
   * @param name
   * @returns
   */
  getNode(name: string): B
}

/**
 * Actor Interface to be extended from decorated Actors.
 * The generic 'B' alludes to what kind of interface this actor will have as composition Body and Nodes.
 */
export declare abstract class ActorInterface<B extends SpriteInterface | MeshInterface> {
  /**
   * Transform of the body.
   */
  get transform(): B extends SpriteInterface ? SpriteTransform : MeshTransform

  /**
   * Gets the ActorComposition class.
   */
  get composition(): ActorComposition<B>

  /**
   * Use a previously defined composition within the Actor class using ActorComposition decorator
   * @param id Composition Id
   * @param CompositionDefinition User custom composition definition
   */
  useComposition(id: string): void

  /**
   * Callback invoked after the actor has been spawned on a scene
   */
  onSpawn?(scene: KJS.Scene): void
}

// ****************
// Camera decorator
// ****************
export declare function Camera(): any
export declare abstract class CameraInterface {
  get babylon(): Pick<BabylonAccessor<ReturnType<this['initialize']>>, 'camera'>

  /**
   * Initialize the camera. This method must return a valid Babylon camera.
   * It will be used from any Scene State requiring it.
   */
  abstract initialize(scene: BabylonScene): BabylonCamera

  /**
   * Callback invoked on loop update.
   * @param delta Time differential since last frame.
   */
  onLoopUpdate?(delta: number): void

  /**
   * Callback invoked on canvas resize.
   * @param canvasSize Canvas Rect.
   */
  onCanvasResize?(size: Rect): void
}

// *********************
// SceneState decorator
// *********************
export { SceneStateProps } from './decorators/scene-state/scene-state-props'
export declare function SceneState(props: SceneStateProps): any
export declare abstract class SceneStateInterface {
  /**
   * Owner scene of this state
   */
  get scene(): SceneType

  /**
   * Sets a camera. Use this method at any point or event of the state lifecycle.
   */
  setCamera(camera: CameraConstructor): void

  /**
   * Invoked on state start. Use this method to setup the scene according to this state start.
   */
  onStart?(scene: SceneType): void

  /**
   * Invoked on state end. Use this method to setup the scene according to this state end.
   */
  onEnd?(): void

  /**
   * Callback invoked on loop update.
   * @param delta Time differential since last frame.
   */
  onLoopUpdate?(delta: number): void

  /**
   * Callback invoked on canvas resize.
   * @param canvasSize Canvas Rect.
   */
  onCanvasResize?(size: Rect): void
}

// ****************
// Scene decorator
// ****************
export { SceneType } from './decorators/scene/scene-type'
export { SceneProps } from './decorators/scene/scene-props'
export declare function Scene(props: SceneProps): any
export declare class SceneSpawn {
  /**
   * Spawns an actor in the scene.
   * @param actor
   * @param compositionId
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
  startState(state: SceneStateConstructor): void

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

// ********
// Modules
// ********
export { Logger } from './modules/logger/logger'
export { LoggerLevels } from './modules/logger/logger-levels'

export declare namespace Helper {
  export namespace Arrays {
    function shuffle(arr: any[], startsOn?: number): void
    function clear(arr: any[]): void
  }

  export namespace Maths {
    function dragValue(ratio: number, origin: number, target: number, ratioClampMin?: number, ratioClampMax?: number): number
    function clamp(value: number, min: number, max: number): number
    function randomInt(minValue: number, maxValue: number): number
    function increaseValue(from: number, to: number, speed: number, completed?: () => void): number
    function increaseValueWithInertia(from: number, to: number, speed: number, acceleration?: number, completed?: () => void): number
    function increaseVector(from: number[], to: number[], speed: number, completed?: () => void): number[]
    function increaseVectorWithInertia(from: number[], to: number[], speed: number, acceleration?: number, completed?: () => void): number[]
  }

  export namespace Vectors {
    function dragPoint(ratio: number, origin: Vector3, target: Vector3, ratioClampMin?: number, ratioClampMax?: number): Vector3
    function vectorialProjectionToLine(vector: Vector3, line: Vector3): Vector3
    function scalarProjectionToLine(vector: Vector3, line: Vector3): number
    function vectorialProjectionToPlane(vector: Vector3, planeNormal: Vector3): Vector3
    function scalarProjectionToPlane(vector: Vector3, line: Vector3): number
    function angleBetweenLines(lineA: Vector3, lineB: Vector3): number
    function angleXBetweenLines(lineA: Vector3, lineB: Vector3): number
    function angleYBetweenLines(lineA: Vector3, lineB: Vector3): number
    function angleZBetweenLines(lineA: Vector3, lineB: Vector3): number
  }
}

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
