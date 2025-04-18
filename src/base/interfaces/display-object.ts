import { MeshAnimation } from '../../decorators/mesh/mesh-animation'
import { MeshAnimationOptions } from '../../decorators/mesh/mesh-animation-options'
import { SceneInterface } from '../../decorators/scene/scene-interface'
import { SpriteAnimation } from '../../decorators/sprite/sprite-animation'
import { SpriteAnimationOptions } from '../../decorators/sprite/sprite-animatrion-options'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { FlexId } from '../../types/flex-id'

export abstract class DisplayObject {
  abstract _animation: SpriteAnimation | MeshAnimation | null
  abstract _animations: Map<FlexId, SpriteAnimation | MeshAnimation>
  abstract _release(): void

  /**
   * User anailable
   */
  abstract loopUpdate: boolean
  abstract get babylon(): Pick<BabylonAccessor, 'mesh' | 'scene'>
  abstract get scene(): SceneInterface
  abstract get enabled(): boolean
  abstract set enabled(value: boolean)
  abstract setFrame(frame: number): void
  abstract addAnimation(animation: SpriteAnimation | MeshAnimation): void
  abstract playAnimation(animation: SpriteAnimation | MeshAnimation | FlexId, options?: SpriteAnimationOptions | MeshAnimationOptions, completed?: () => void): void
  abstract stopAnimation(): void
  abstract subscribeToKeyframe(keyframeId: string, callback: () => void): void
  abstract clearKeyframeSubscriptions(keyframeId: string): void
  abstract destroy(): void
}
