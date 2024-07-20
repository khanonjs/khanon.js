import { Observable } from '@babylonjs/core'

import { FlexId } from '../types'

export interface AnimationKeyFrame {
  /**
   * Id of the keyframe.
   */
  id: FlexId

  /**
   * Frames to trigger the emitter.
   */
  frames: number[]

  /**
   * Observable emitter.
   */
  emitter: Observable<void>

  /**
   * Milliseconds to trigger it
   */
  ms: number[]
}
