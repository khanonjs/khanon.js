import { AnimationBase } from '../../models/animation-base'

export interface SpriteAnimation extends AnimationBase {
  frameStart: number
  frameEnd: number
  delay: number
}
