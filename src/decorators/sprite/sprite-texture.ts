import { DynamicTexture } from '@babylonjs/core'
import { SpriteManager } from '@babylonjs/core/Sprites/spriteManager'

import { BabylonContainer } from '../../models'
import { SceneType } from '../scene/scene-type'

export class SpriteTexture {
  private readonly MAX_SPRITES_PER_INSTANCE = 9999

  babylon: Pick<BabylonContainer, 'spriteManager' | 'scene'>
  width: number
  height: number

  constructor(private readonly scene: SceneType) {
    this.babylon.scene = scene.babylon.scene
  }

  setFromUrl(url: string, width: number, height: number): void {
    this.width = width
    this.height = height
    this.babylon.spriteManager = new SpriteManager(url, url, this.MAX_SPRITES_PER_INSTANCE, { width, height }, this.babylon.scene)
  }

  setFromBlank(width: number, height: number): void {
    this.width = width
    this.height = height
    this.babylon.spriteManager = new SpriteManager(
      'FromDynamicTexture',
      '',
      this.MAX_SPRITES_PER_INSTANCE,
      { width: this.width, height: this.height },
      this.babylon.scene
    )
  }

  setFromDynamicTexture(texture: DynamicTexture, width?: number, height?: number): void {
    this.width = width ?? texture.getSize().width
    this.height = height ?? texture.getSize().height
    this.babylon.spriteManager = new SpriteManager(
      'FromDynamicTexture',
      '',
      this.MAX_SPRITES_PER_INSTANCE,
      { width: this.width, height: this.height },
      this.babylon.scene
    )
    this.babylon.spriteManager.texture = texture
  }

  dispose(): void {
    this.babylon.spriteManager.dispose()
    this.babylon.spriteManager = null
  }
}
