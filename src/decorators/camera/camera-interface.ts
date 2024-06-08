import {
  Camera as BabylonCamera,
  Scene as BabylonScene
} from '@babylonjs/core'

import { LoopUpdatable } from '../../base'
import { BabylonAccessor } from '../../models'

export abstract class CameraInterface implements LoopUpdatable {
  abstract babylon: Pick<BabylonAccessor<BabylonCamera>, 'camera'>
  initialize?(scene: BabylonScene): BabylonCamera
  loopUpdate?(delta: number): void
}
