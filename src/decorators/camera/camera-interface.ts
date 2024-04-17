import { Camera as BabylonCamera } from '@babylonjs/core'

import { LoopUpdatable } from '../../base'
import { BabylonAccessor } from '../../models'

export abstract class CameraInterface implements LoopUpdatable {
  abstract babylon: Pick<BabylonAccessor<ReturnType<this['initialize']>>, 'camera'>
  initialize?(): BabylonCamera
  loopUpdate?(delta: number): void
}
