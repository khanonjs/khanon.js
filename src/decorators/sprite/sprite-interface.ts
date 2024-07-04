import {
  Observer,
  Sprite as BabylonSprite
} from '@babylonjs/core'

import { DisplayObject } from '../../base/classes/display-object'
import {
  BabylonAccessor,
  Rect
} from '../../models'
import { SpriteTransform } from '../../types'
import { SceneInterface } from '../scene/scene-interface'
import { SceneType } from '../scene/scene-type'
import { SpriteTexture } from './sprite-texture'

export abstract class SpriteInterface extends DisplayObject {
  /**
   * Private
   */
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>
  abstract initialize?(spriteTexture?: SpriteTexture): void

  /**
   * Public
   */
  abstract babylon: Pick<BabylonAccessor, 'spriteManager' | 'sprite'>
  abstract scene: SceneType
  abstract transform: SpriteTransform
  abstract loopUpdate: boolean
  abstract setSprite(babylonSprite: BabylonSprite): void
  abstract setFrame(frame: number): void

  /**
   * User defined
   */
  onSpawn?(scene: SceneInterface): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
