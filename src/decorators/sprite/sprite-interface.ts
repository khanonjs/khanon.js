import * as BABYLON from '@babylonjs/core'

import { DisplayObject } from '../../base'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { DrawBlockProperties } from '../../models/draw-text-properties'
import { Rect } from '../../models/rect'
import {
  FlexId,
  SpriteTransform
} from '../../types'
import { MeshAnimation } from '../mesh/mesh-animation'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from './sprite-animation'
import { SpriteProps } from './sprite-props'
import { SpriteTexture } from './sprite-texture'

export abstract class SpriteInterface implements DisplayObject {
  abstract props: SpriteProps
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract exclusiveTexture: boolean // Exclusive texture means this sprite has an exclusive texture that is not stored anywhere, so the sprite itself has to handle its release.
  abstract animation: SpriteAnimation | MeshAnimation
  abstract animations: Map<FlexId, SpriteAnimation | MeshAnimation>
  abstract _scale: number
  abstract setTexture(spriteTexture: SpriteTexture, isExclusive: boolean, isParticle: boolean): void
  abstract release(): void

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
  abstract setFrame(frame: number): void
  abstract setFrameFirst(): void
  abstract setFrameLast(): void
  abstract addAnimation(animation: SpriteAnimation | MeshAnimation): void
  abstract playAnimation(animation: SpriteAnimation | MeshAnimation | FlexId, loopOverride?: boolean, completed?: () => void): void
  abstract stopAnimation(): void
  abstract subscribeToKeyframe(keyframeId: string, callback: () => void): void
  abstract clearKeyframeSubscriptions(keyframeId: string): void
  abstract drawText(text: string, properties: DrawBlockProperties): void
  abstract destroy(): void

  /**
   * User defined optional
   */
  onSpawn?(scene: SceneInterface): void
  onDestroy?(): void
  onLoopUpdate?(delta: number): void
}
