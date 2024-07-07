import {
  Mesh as BabylonMesh,
  Scene as BabylonScene,
  Sprite as BabylonSprite
} from '@babylonjs/core'

import { LoadingProgress } from './base'
import { SceneConstructor } from './constructors/scene-constructor'
import { SceneStateConstructor } from './constructors/scene-state-constructor'

// ****************************
//  Babylon.js renamed objects
// ****************************
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
export { ActorConstructor } from './constructors/actor-constructor'
export { ActorEventConstructor } from './constructors/actor-event-constructor'
export { ActorStateConstructor } from './constructors/actor-state-constructor'
export { AppConstructor } from './constructors/app-constructor'
export { CameraConstructor } from './constructors/camera-constructor'
export { GUIConstructor } from './constructors/gui-constructor'
export { MeshConstructor } from './constructors/mesh-constructor'
export { MeshMapConstructor } from './constructors/mesh-map-constructor'
export { MotionConstructor } from './constructors/motion-constructor'
export { ParticleConstructor } from './constructors/particle-constructor'
export { ParticleSourceConstructor } from './constructors/particle-source-constructor'
export { SceneConstructor } from './constructors/scene-constructor'
export { SceneEventConstructor } from './constructors/scene-event-constructor'
export { SceneStateConstructor } from './constructors/scene-state-constructor'
export { TileMapConstructor } from './constructors/tile-map-constructor'
export { SceneMapConstructor } from './constructors/scene-map-constructor'
export { SpriteConstructor } from './constructors/sprite-constructor'

// ****************
// KJS App handler
// ****************
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
  /* export type Actor = ActorInterface<any>;
  export type Scene = SceneInterface; */

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

export * from './decorators/app'
export * from './decorators/sprite'
export * from './decorators/mesh'
export * from './decorators/actor'
export * from './decorators/scene'
export * from './decorators/scene/scene-state'
export * from './decorators/scene/scene-event'
export * from './models'
export * from './modules'
