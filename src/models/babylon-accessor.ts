import * as BABYLON from '@babylonjs/core'

/**
 * Object exposed in Khanon.js wrappers enablig access to Babylon.js classes and objects
 */
export interface BabylonAccessor<C extends BABYLON.Camera = any> {
  camera: C
  engine: BABYLON.Engine
  scene: BABYLON.Scene
  sprite: BABYLON.Sprite
  mesh: BABYLON.Mesh
  spriteManager: BABYLON.SpriteManager
}
