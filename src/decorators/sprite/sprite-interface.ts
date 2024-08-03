import * as BABYLON from '@babylonjs/core'

import { DisplayObject } from '../../base'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { DrawBlockProperties } from '../../models/draw-text-properties'
import { Rect } from '../../models/rect'
import { SpriteTransform } from '../../types'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteTexture } from './sprite-texture'

export abstract class SpriteInterface extends DisplayObject {
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract canvasResize$?: BABYLON.Observer<Rect>
  abstract exclusiveTexture?: boolean // Exclusive texture means this sprite has an exclusive texture that is not stored anywhere, so the sprite itself has to handle its release.
  abstract setTexture?(spriteTexture: SpriteTexture, isExclusive: boolean): void

  /**
   * User available
   */
  abstract loopUpdate: boolean
  abstract get babylon(): Pick<BabylonAccessor, 'scene' | 'spriteManager' | 'sprite'>
  abstract get scene(): SceneInterface
  abstract get transform(): SpriteTransform
  abstract get width(): number
  abstract get height(): number
  abstract set scale(scale: number)
  abstract get scale(): number
  abstract drawText(text: string, properties: DrawBlockProperties): void

  /**
   * User defined
   */
  onSpawn?(scene: SceneInterface): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
