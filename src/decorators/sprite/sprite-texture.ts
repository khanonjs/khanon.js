import {
  DynamicTexture,
  Texture
} from '@babylonjs/core'
import { SpriteManager } from '@babylonjs/core/Sprites/spriteManager'

import { BabylonContainer } from '../../models'
import { SceneType } from '../scene/scene-type'

export class SpriteTexture {
  private readonly MAX_SPRITES_PER_INSTANCE = 9999 // 8a8f

  babylon: Pick<BabylonContainer, 'spriteManager' | 'scene'>
  width: number
  height: number

  constructor(scene: SceneType) {
    this.babylon.scene = scene.babylon.scene
  }

  setFromArrayBuffer(buffer: ArrayBuffer): void {
    // 8a8f apply TextureOptions
    const texture = new Texture('', this.babylon.scene, undefined, undefined, undefined, undefined, undefined, buffer, false)
    this.setFromTexture(texture)
  }

  setFromBlank(width: number, height: number): void {
    // 8a8f apply TextureOptions
    const texture = new Texture('', this.babylon.scene)
    this.setFromTexture(texture, width, height)
  }

  setFromTexture(texture: Texture | DynamicTexture, width?: number, height?: number): void {
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
