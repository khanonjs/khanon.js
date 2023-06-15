import { AnimationKeyFrame } from './animation-keyframe'

export interface AnimationBase {
    delay: number
    loop: boolean
    frameStart?: number
    frameEnd?: number
    keyFrames?: AnimationKeyFrame[]
}
