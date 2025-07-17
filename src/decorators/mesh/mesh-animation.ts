import { AnimationGroup } from '@babylonjs/core/Animations/animationGroup'

import { AnimationBase } from '../../models/animation-base'

export interface MeshAnimation extends AnimationBase {
  animationGroup: AnimationGroup
  speedRatio?: number
}
