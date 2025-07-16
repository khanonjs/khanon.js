

import { AnimationBase } from '../../models/animation-base'

export interface MeshAnimation extends AnimationBase {
  animationGroup: BABYLON.AnimationGroup
  speedRatio?: number
}
