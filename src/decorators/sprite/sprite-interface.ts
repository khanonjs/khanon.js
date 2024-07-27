import * as BABYLON from '@babylonjs/core'

import { DisplayObject } from '../../base'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { SpriteTransform } from '../../types'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteTexture } from './sprite-texture'

export abstract class SpriteInterface extends DisplayObject {
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract canvasResize$?: BABYLON.Observer<Rect>
  abstract initialize?(spriteTexture?: SpriteTexture): void

  /**
   * User available
   */
  abstract loopUpdate: boolean
  abstract get babylon(): Pick<BabylonAccessor, 'spriteManager' | 'sprite'>
  abstract get scene(): SceneInterface
  abstract get transform(): SpriteTransform
  abstract get width(): number
  abstract get height(): number
  abstract set scale(scale: number)
  abstract get scale(): number
  // abstract writeText(): void // 8a8f 'writeText' method to sprite to write texts in it. (x,y,width, height, aligment, etc)

  /**
   * User defined
   */
  onSpawn?(scene: SceneInterface): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
