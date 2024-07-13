import { Matrix } from '@babylonjs/core/Maths/math.vector'

import { MeshAnimation } from '../../decorators/mesh/mesh-animation'
import { SpriteAnimation } from '../../decorators/sprite/sprite-animation'
import {
  MeshTransform,
  SpriteTransform
} from '../../types'

export abstract class DisplayObject {
  abstract animation?: SpriteAnimation | MeshAnimation
  abstract animations?: Map<string, SpriteAnimation | MeshAnimation>

  abstract release?(): void

  // User anailable
  abstract transform: SpriteTransform | MeshTransform

  abstract setTransform(transform: Matrix): void
  abstract getTransform(): Matrix

  abstract setFrame(frame: number): void
  abstract setFirstFrame(): void
  abstract setLastFrame(): void

  abstract addAnimation(animation: SpriteAnimation | MeshAnimation): void
  abstract playAnimation(animation: SpriteAnimation | MeshAnimation | string, loopOverride?: boolean, completed?: () => void): void
  abstract stopAnimation(): void

  abstract subscribeToKeyframe(keyframeName: string, callback: () => void): void
  abstract clearKeyframeSubscriptions(keyframeName: string): void
}
