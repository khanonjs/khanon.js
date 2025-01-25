import { MeshAnimation } from '../../decorators/mesh/mesh-animation'
import { SpriteAnimation } from '../../decorators/sprite/sprite-animation'
import { FlexId } from '../../types/flex-id'

export abstract class DisplayObject {
  abstract animation: SpriteAnimation | MeshAnimation | null
  abstract animations: Map<FlexId, SpriteAnimation | MeshAnimation>

  abstract release(): void

  // User anailable
  abstract addAnimation(animation: SpriteAnimation | MeshAnimation): void
  abstract playAnimation(animation: SpriteAnimation | MeshAnimation | FlexId, loopOverride?: boolean, completed?: () => void): void
  abstract stopAnimation(): void

  abstract subscribeToKeyframe(keyframeId: string, callback: () => void): void // 8a8f this only for sprites?
  abstract clearKeyframeSubscriptions(keyframeId: string): void // 8a8f this only for sprites?
}
