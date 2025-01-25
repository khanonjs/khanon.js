import { AnimationBase } from '../../models/animation-base'
import { AnimationKeyFrame } from '../../models/animation-keyframe'

export interface SpriteAnimation extends AnimationBase {
  frameStart: number
  frameEnd: number
  delay: number
  keyFrames?: AnimationKeyFrame[]
}
