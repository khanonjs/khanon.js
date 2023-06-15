import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture'
import { Scene as BabylonJsScene } from '@babylonjs/core/scene'

import { TextBlockProperties } from '../models/textblock-properties'

export class DynamicTextures {
  /**
     * Creates a Dynamic Texture containing a multi-line text block.
     *
     * @param babylonJsScene
     * @param properties
     * @returns
     */
  static createFromTextBlock(babylonJsScene: BabylonJsScene, properties: TextBlockProperties): DynamicTexture {
    const font = `${properties.fontStyle} ${properties.fontSize}px ${properties.fontName}`

    const checkSizeTx = new DynamicTexture('DynamicTexture', 64, babylonJsScene, false)
    const canvasTmp = document.createElement('canvas')
    const ctx = canvasTmp.getContext('2d')
    ctx.font = font
    const metricsFirst = ctx.measureText(properties.textBlock[0])

    let textWidth = 0
    const lineHeight = metricsFirst.actualBoundingBoxAscent + metricsFirst.actualBoundingBoxDescent
    const textHeight = lineHeight * properties.textBlock.length
    checkSizeTx.dispose()
    properties.textBlock.forEach((text) => {
      if (ctx.measureText(text).width > textWidth) {
        textWidth = ctx.measureText(text).width
      }
    })
    const textureWidth = properties.textureSize?.width ?? textWidth
    const textureHeight = properties.textureSize?.height ?? textHeight + properties.fontSize / 2

    const dynamicTexture = new DynamicTexture('DynamicTexture', { width: textureWidth, height: textureHeight }, babylonJsScene, false)
    const ctxTx = dynamicTexture.getContext()
    if (properties.bgColor) {
      ctxTx.beginPath()
      ctxTx.rect(0, 0, textureWidth, textureHeight)
      ctxTx.fillStyle = properties.bgColor
      ctxTx.fill()
    }

    const startY = properties.centerV && properties.textureSize ? textureHeight / 2 - (lineHeight / 2) * (properties.textBlock.length - 1) : lineHeight
    properties.textBlock.forEach((text, index) => {
      dynamicTexture.drawText(text, properties.centerH ? null : 0, startY + lineHeight * index, font, properties.textColor, null, false)
    })

    return dynamicTexture
  }
}
