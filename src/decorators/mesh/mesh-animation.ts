import * as BABYLON from '@babylonjs/core'

import { AnimationBase } from '../../models/animation-base'

export interface MeshAnimation extends AnimationBase {
  animationGroup: BABYLON.AnimationGroup
  speedRatio?: number
}
