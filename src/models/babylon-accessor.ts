import * as BABYLON from '@babylonjs/core'
import * as BABYLONGUI from '@babylonjs/gui'

export interface BabylonAccessor<
    C extends BABYLON.TargetCamera = BABYLON.TargetCamera,
    M extends BABYLON.AbstractMesh = BABYLON.AbstractMesh,
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
  gui: BABYLONGUI.AdvancedDynamicTexture
}
