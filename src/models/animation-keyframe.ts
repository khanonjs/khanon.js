import * as BABYLON from '@babylonjs/core'

import { FlexId } from '../types/flex-id'

export interface AnimationKeyFrame {
  id: FlexId
  frames: number[]
  emitter: BABYLON.Observable<void>
  ms: number[]
}
