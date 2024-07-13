import * as BABYLON from '@babylonjs/core'

import { DisplayObject } from '../../base'
import {
  BabylonAccessor,
  Rect
} from '../../models'
import { SpriteTransform } from '../../types'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from './sprite-animation'
import { SpriteTexture } from './sprite-texture'

export abstract class SpriteInterface extends DisplayObject {
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract canvasResize$?: BABYLON.Observer<Rect>
  abstract animations?: Map<string, SpriteAnimation>
  abstract keyframesSubscriptions?: Map<string, { context: any, observer: BABYLON.Observer<void> }>
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
  abstract setFrame(frame: number): void
  abstract setFirstFrame(): void
  abstract setLastFrame(): void
  abstract addAnimation(animation: SpriteAnimation): void
  abstract subscribeToKeyframe(keyframeName: string, callback: () => void): void
  abstract clearKeyframeSubscriptions(keyframeName: string): void
  abstract playAnimation(animation: SpriteAnimation | string, loopOverride?: boolean, completed?: () => void): void

  /**
   * User defined
   */
  onSpawn?(scene: SceneInterface): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
