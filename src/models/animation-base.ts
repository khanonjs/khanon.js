import { FlexId } from '../types/flex-id'
import { AnimationKeyFrame } from './animation-keyframe'

export interface AnimationBase {
  id: FlexId
  frameStart: number
  frameEnd: number
  delay: number
  loop?: boolean
  keyFrames?: AnimationKeyFrame[]
}
