import { Observable } from '@babylonjs/core/Misc/observable'

import { FlexId } from '../types/flex-id'

export interface AnimationKeyFrame {
  id: FlexId
  frames: number[]
  emitter: Observable<void>
  ms: number[]
}
