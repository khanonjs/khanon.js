import {
  DynamicTexture,
  Texture
} from '@babylonjs/core'
import { SpriteManager } from '@babylonjs/core/Sprites/spriteManager'

import { Asset } from '../../base'
import { BabylonAccessor } from '../../models'
import { Logger } from '../../modules'
import { SceneType } from '../scene/scene-type'
import { SpriteProps } from './sprite-props'

export class SpriteTexture {
  babylon: Pick<BabylonAccessor, 'spriteManager' | 'scene'> = { spriteManager: null, scene: null }
  width: number
  height: number

  constructor(scene: SceneType, private readonly spriteProps: SpriteProps) {
    this.babylon.scene = scene.babylon.scene
  }

  setFromAsset(asset: Asset<SceneType>): void {
    const width = this.spriteProps.width ?? this.spriteProps.cellWidth
    const height = this.spriteProps.height ?? this.spriteProps.cellHeight
    const texture = new Texture(asset.objectURL, this.babylon.scene, this.spriteProps.textureOptions)
    texture.name = asset.definition.url
    this.setFromTexture(texture, width, height, asset.definition.url)
  }

  setFromBlank(): void {
    const texture = new Texture('', this.babylon.scene, this.spriteProps.textureOptions)
    this.setFromTexture(texture, this.spriteProps.width, this.spriteProps.height)
  }

  setFromTexture(texture: Texture | DynamicTexture, width?: number, height?: number, name?: string): void {
    this.width = width ?? texture.getSize().width
    this.height = height ?? texture.getSize().height
    this.babylon.spriteManager = new SpriteManager(
      name ?? '',
      null,
      this.spriteProps.maxAllowedSprites,
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
