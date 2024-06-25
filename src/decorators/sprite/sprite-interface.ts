import { Sprite as BabylonSprite } from '@babylonjs/core'

import { DisplayObject } from '../../base/classes/display-object'
import { BabylonAccessor } from '../../models'
import { SceneInterface } from '../scene/scene-interface'
import { SceneType } from '../scene/scene-type'

export abstract class SpriteInterface extends DisplayObject {
  /**
   * Public
   */
  abstract babylon: Pick<BabylonAccessor, 'scene' | 'spriteManager'>
  abstract scene: SceneType
  abstract setSprite(babylonSprite: BabylonSprite): void

  /**
   * User defined
   */
  abstract onSpawn?(scene: SceneInterface): void
}
