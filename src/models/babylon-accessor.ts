import { Camera } from '@babylonjs/core'
import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Sprite } from '@babylonjs/core/Sprites'
import { SpriteManager } from '@babylonjs/core/Sprites/spriteManager'

/**
 * Object exposed in Khanon.js wrappers enablig access to Babylon.js classes and objects
 */
export interface BabylonAccessor<C extends Camera = any> {
  camera: C
  engine: Engine
  scene: Scene
  sprite: Sprite
  spriteManager: SpriteManager
}
