import { DynamicTexture } from '@babylonjs/core'
import { Scene as BabylonJsScene } from '@babylonjs/core/scene'
import { SpriteManager } from '@babylonjs/core/Sprites/spriteManager'

/**
 * Class based on BabylonJs SpriteManager
 * TODO: Switch SpriteManager by SpritePackedManager once BabylonJs team implement all missing features
 */
export class SpriteTexture {
  private readonly MAX_SPRITES_PER_INSTANCE = 9999

  babylonjs: SpriteManager
  width: number
  height: number

  constructor(private readonly id: string, private readonly babylonJsScene: BabylonJsScene) {}

  setFromUrl(url: string, width: number, height: number): void {
    this.width = width
    this.height = height
    this.babylonjs = new SpriteManager(url, url, this.MAX_SPRITES_PER_INSTANCE, { width, height }, this.babylonJsScene)
  }

  setFromDynamicTexture(texture: DynamicTexture, width?: number, height?: number): void {
    this.width = width ?? texture.getSize().width
    this.height = height ?? texture.getSize().height
    this.babylonjs = new SpriteManager(
      'FromDynamicTexture',
      '',
      this.MAX_SPRITES_PER_INSTANCE,
      { width: this.width, height: this.height },
      this.babylonJsScene
    )
    this.babylonjs.texture = texture
  }

  release(): void {
    if (this.babylonjs) {
      this.babylonjs.dispose()
      this.babylonjs = null
    }
  }
}
