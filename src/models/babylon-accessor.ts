import * as BABYLON from '@babylonjs/core'

export interface BabylonAccessor<C extends BABYLON.Camera = any> {
  camera: C
  engine: BABYLON.Engine
  scene: BABYLON.Scene
  sprite: BABYLON.Sprite
  mesh: BABYLON.Mesh
  spriteManager: BABYLON.SpriteManager
}
