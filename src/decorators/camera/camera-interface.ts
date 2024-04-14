import { Camera as BabylonCamera } from '@babylonjs/core'

import { LoopUpdatable } from '../../base'

export abstract class CameraInterface<C extends BabylonCamera> implements LoopUpdatable {
  abstract camera: C
  abstract initialize(): C
  abstract loopUpdate?(delta: number): void
}
