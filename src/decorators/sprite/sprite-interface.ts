import * as BABYLON from '@babylonjs/core'

import { DisplayObject } from '../../base'
import {
  BabylonAccessor,
  Rect
} from '../../models'
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
  abstract babylon: Pick<BabylonAccessor, 'spriteManager' | 'sprite'>
  abstract scene: SceneInterface
  abstract transform: SpriteTransform
  abstract loopUpdate: boolean
  abstract get width(): number
  abstract get height(): number
  abstract set scale(scale: number)
  abstract get scale(): number

  /**
   * User defined
   */
  onSpawn?(scene: SceneInterface): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
