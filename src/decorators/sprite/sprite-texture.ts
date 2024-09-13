import * as BABYLON from '@babylonjs/core'

import { Asset } from '../../base'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Logger } from '../../modules/logger'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteProps } from './sprite-props'

export class SpriteTexture {
  babylon: Pick<BabylonAccessor, 'spriteManager' | 'scene'> = { spriteManager: null as any, scene: null as any }
  width: number
  height: number

  constructor(scene: SceneInterface, private readonly spriteProps: SpriteProps) {
    this.babylon.scene = scene.babylon.scene
  }

  setFromAsset(asset: Asset<SceneInterface>): void {
    const width = this.spriteProps.width
    const height = this.spriteProps.height
    const texture = new BABYLON.Texture(asset.objectURL, this.babylon.scene, this.spriteProps.noMipmap, this.spriteProps.invertY, this.spriteProps.samplingMode)
    texture.name = asset.definition.url
    this.setFromTexture(texture, asset.definition.url, width, height)
  }

  setFromBlank(): void {
    const texture = new BABYLON.DynamicTexture('blank-texture', { width: this.spriteProps.width, height: this.spriteProps.height }, this.babylon.scene, !this.spriteProps.noMipmap, this.spriteProps.samplingMode, this.spriteProps.format, this.spriteProps.invertY)
    this.setFromTexture(texture, 'no-url', this.spriteProps.width, this.spriteProps.height)
  }

  setFromTexture(texture: BABYLON.Texture | BABYLON.DynamicTexture, name: string, width?: number, height?: number): void {
    this.width = width ?? texture.getSize().width
    this.height = height ?? texture.getSize().height
    if (this.width === 0 || this.height === 0) { Logger.debugError('Width and Height must be higher than 0:', this.spriteProps) }
    this.babylon.spriteManager = new BABYLON.SpriteManager(
      name,
      '',
      this.spriteProps.maxAllowedSprites,
      { width: this.width, height: this.height },
      this.babylon.scene
    )
    this.babylon.spriteManager.texture = texture
  }

  dispose(): void {
    this.babylon.spriteManager.dispose()
    this.babylon.spriteManager = null as any
  }
}
