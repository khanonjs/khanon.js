import { FlexId } from '../types/flex-id'
import { AnimationKeyFrame } from './animation-keyframe'

export interface AnimationBase {
  id: FlexId
  loop?: boolean
  keyFrames?: AnimationKeyFrame[]
}
