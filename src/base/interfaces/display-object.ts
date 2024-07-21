import * as BABYLON from '@babylonjs/core'

import { MeshAnimation } from '../../decorators/mesh/mesh-animation'
import { SpriteAnimation } from '../../decorators/sprite/sprite-animation'
import {
  FlexId,
  MeshTransform,
  SpriteTransform
} from '../../types'

export abstract class DisplayObject {
  abstract animation?: SpriteAnimation | MeshAnimation
  abstract animations?: Map<FlexId, SpriteAnimation | MeshAnimation>

  abstract release?(): void

  // User anailable
  abstract transform: SpriteTransform | MeshTransform // 8a8f

  abstract setTransform(transform: BABYLON.Matrix): void // 8a8f
  abstract getTransform(): BABYLON.Matrix // 8a8f

  abstract setFrame(frame: number): void
  abstract setFrameFirst(): void
  abstract setFrameLast(): void

  abstract addAnimation(animation: SpriteAnimation | MeshAnimation): void
  abstract playAnimation(animation: SpriteAnimation | MeshAnimation | string, loopOverride?: boolean, completed?: () => void): void
  abstract stopAnimation(): void

  abstract subscribeToKeyframe(keyframeId: string, callback: () => void): void
  abstract clearKeyframeSubscriptions(keyframeId: string): void
}
