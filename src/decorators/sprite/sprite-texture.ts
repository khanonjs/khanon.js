import {
  DynamicTexture,
  Texture
} from '@babylonjs/core'
import { SpriteManager } from '@babylonjs/core/Sprites/spriteManager'

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

  setFromArrayBuffer(buffer: ArrayBuffer): void {
    const texture = new Texture(/* './assets/scene-intro/sprites/sun.png' */undefined, this.babylon.scene, { ...this.spriteProps.textureOptions, buffer })
    // const texture = new Texture('./assets/scene-intro/sprites/sun.png', this.babylon.scene, { ...this.spriteProps.textureOptions/*, buffer */ })
    Logger.trace('aki Texture', { ...this.spriteProps.textureOptions, buffer }/* texture */)
    // 8a8f ver qué hace con ITextureCreationOptions cuando la crea de archivo y si falta algo ahí
    // Una opción es almacenar el spriteManager en lugar del buffer, y clonarlo para cada escena
    // Buscar cómo carga de archivo y comparar con cómo carga de buffer, debe faltar alguna propiedad o formato por definir
    // https://www.html5gamedevs.com/topic/11405-is-possible-to-load-textures-from-a-arraybufferview/
    this.setFromTexture(texture, this.spriteProps.width ?? this.spriteProps.cellWidth, this.spriteProps.height ?? this.spriteProps.cellHeight)
  }

  setFromBlank(): void {
    const texture = new Texture('', this.babylon.scene, this.spriteProps.textureOptions)
    this.setFromTexture(texture, this.spriteProps.width, this.spriteProps.height)
  }

  setFromTexture(texture: Texture | DynamicTexture, width?: number, height?: number): void {
    this.width = width ?? texture.getSize().width
    this.height = height ?? texture.getSize().height
    this.babylon.spriteManager = new SpriteManager(
      'FromDynamicTexture',
      '', // 8a8f File name
      this.spriteProps.maxAllowedSprites,
      { width: this.width, height: this.height },
      this.babylon.scene
    )
    Logger.trace('aki SpriteManager', texture)
    this.babylon.spriteManager.texture = texture
  }

  dispose(): void {
    this.babylon.spriteManager.dispose()
    this.babylon.spriteManager = null
  }
}
