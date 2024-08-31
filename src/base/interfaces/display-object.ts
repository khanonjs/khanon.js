import { MeshAnimation } from '../../decorators/mesh/mesh-animation'
import { SpriteAnimation } from '../../decorators/sprite/sprite-animation'
import { FlexId } from '../../types/flex-id'
import { MeshTransform } from '../../types/mesh-transform'
import { SpriteTransform } from '../../types/sprite-transform'

export abstract class DisplayObject {
  abstract animation: SpriteAnimation | MeshAnimation
  abstract animations: Map<FlexId, SpriteAnimation | MeshAnimation>

  abstract release(): void

  // User anailable
  abstract get transform(): SpriteTransform | MeshTransform

  // abstract setTransform(transform: BABYLON.Matrix): void // TODO
  // abstract getTransform(): BABYLON.Matrix // TODO

  abstract setFrame(frame: number): void
  abstract setFrameFirst(): void
  abstract setFrameLast(): void

  abstract addAnimation(animation: SpriteAnimation | MeshAnimation): void
  abstract playAnimation(animation: SpriteAnimation | MeshAnimation | FlexId, loopOverride?: boolean, completed?: () => void): void
  abstract stopAnimation(): void

  abstract subscribeToKeyframe(keyframeId: string, callback: () => void): void
  abstract clearKeyframeSubscriptions(keyframeId: string): void
}
