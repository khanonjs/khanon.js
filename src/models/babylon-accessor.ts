import * as BABYLON from '@babylonjs/core'

export interface BabylonAccessor<
    C extends BABYLON.Camera = BABYLON.Camera,
    M extends BABYLON.Mesh = BABYLON.Mesh,
    N extends BABYLON.Material = BABYLON.Material
  > {
  camera: C
  engine: BABYLON.Engine
  scene: BABYLON.Scene
  sprite: BABYLON.Sprite
  mesh: M
  spriteManager: BABYLON.SpriteManager
  particleSystem: BABYLON.ParticleSystem
  texture: BABYLON.Texture | BABYLON.DynamicTexture
  material: N
}
