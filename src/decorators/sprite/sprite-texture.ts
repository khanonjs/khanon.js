import { DynamicTexture } from '@babylonjs/core'
import { Scene as BabylonScene } from '@babylonjs/core/scene'
import { SpriteManager } from '@babylonjs/core/Sprites/spriteManager'

export class SpriteTexture {
  private readonly MAX_SPRITES_PER_INSTANCE = 9999

  babylonSpriteManager: SpriteManager
  width: number
  height: number

  constructor(private readonly id: string, private readonly babylonScene: BabylonScene) {}

  setFromUrl(url: string, width: number, height: number): void {
    this.width = width
    this.height = height
    this.babylonSpriteManager = new SpriteManager(url, url, this.MAX_SPRITES_PER_INSTANCE, { width, height }, this.babylonScene)
  }

  setFromDynamicTexture(texture: DynamicTexture, width?: number, height?: number): void {
    this.width = width ?? texture.getSize().width
    this.height = height ?? texture.getSize().height
    this.babylonSpriteManager = new SpriteManager(
      'FromDynamicTexture',
      '',
      this.MAX_SPRITES_PER_INSTANCE,
      { width: this.width, height: this.height },
      this.babylonScene
    )
    this.babylonSpriteManager.texture = texture
  }

  release(): void {
    this.babylonSpriteManager.dispose()
    this.babylonSpriteManager = null
  }
}
