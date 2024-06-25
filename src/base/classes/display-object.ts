import { Matrix } from '@babylonjs/core/Maths/math.vector'

import { MeshAnimation } from '../../decorators/mesh/mesh-animation'
import { SpriteAnimation } from '../../decorators/sprite/sprite-animation'
import {
  MeshTransform,
  SpriteTransform
} from '../../types'

export abstract class DisplayObject {
  abstract transform: SpriteTransform | MeshTransform

  abstract setTransform(transform: Matrix): void
  abstract getTransform(): Matrix

  abstract playAnimation(animation: SpriteAnimation | MeshAnimation, loopOverride?: boolean, completed?: () => void): void
  abstract stopAnimation(): void

  abstract release?(): void
}
