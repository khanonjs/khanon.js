import { FlexId } from '../types/flex-id'
import { AnimationKeyFrame } from './animation-keyframe'

export interface AnimationBase {
  id: FlexId
  delay?: number
  loop?: boolean
  frameStart?: number
  frameEnd?: number
  keyFrames?: AnimationKeyFrame[]
}
