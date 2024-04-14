import { LoopUpdatable } from '../../base'
import { CameraConstructor } from '../../constructors'
import { BabylonAccessor } from '../../models'

export abstract class StateInterface implements LoopUpdatable {
  abstract babylon: Pick<BabylonAccessor, 'scene'>
  abstract useCamera(camera: CameraConstructor): void
  abstract onStart?(): void
  abstract onEnd?(): void
  abstract loopUpdate?(delta: number): void
}
