import { Scene as BabylonJsScene } from '@babylonjs/core/scene'

import { TextBlockProperties } from '../models/textblock-properties'
import { SpriteTexture } from '../modules/sprite/sprite-texture'
import { Arrays } from './arrays'
import { DynamicTextures } from './dynamic-textures'

export class SpriteTextures {
  static createFromTextBlock(id: string, babylonJsScene: BabylonJsScene, textBlock: string[], textBlockProperties: TextBlockProperties): SpriteTexture {
    const dynamicTexture = DynamicTextures.createFromTextBlock(babylonJsScene, Object.assign(textBlockProperties, { textBlock }))
    const spriteTexture = new SpriteTexture(id, babylonJsScene)
    spriteTexture.setFromDynamicTexture(dynamicTexture)
    return spriteTexture
  }

  static createListFromTextBlock(
    id: string,
    babylonJsScene: BabylonJsScene,
    textBlocks: string[][],
    textBlockProperties: TextBlockProperties
  ): SpriteTexture[] {
    const arr: SpriteTexture[] = []
    textBlocks.forEach((textBlock) => {
      arr.push(SpriteTextures.createFromTextBlock(id, babylonJsScene, textBlock, textBlockProperties))
    })
    return arr
  }

  static releaseList(arr: SpriteTexture[]): void {
    if (arr) {
      arr.forEach((texture) => {
        texture.release()
      })
      Arrays.empty(arr)
    }
  }
}
