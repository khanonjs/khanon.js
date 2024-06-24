import { Matrix } from '@babylonjs/core/Maths/math.vector'

import { MeshAnimation } from '../../decorators/mesh/mesh-animation'
import { SpriteAnimation } from '../../decorators/sprite/sprite-animation'

export abstract class DisplayObject {
  abstract set visible(value: boolean)
  abstract get visible(): boolean

  abstract setTransform(transform: Matrix): void
  abstract getTransform(): Matrix

  abstract playAnimation(animation: SpriteAnimation | MeshAnimation, loopOverride?: boolean, completed?: () => void): void
  abstract stopAnimation(): void
}
