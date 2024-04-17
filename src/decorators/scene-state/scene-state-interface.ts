import { LoopUpdatable } from '../../base'
import { CameraConstructor } from '../../constructors'
import { BabylonAccessor } from '../../models'

export abstract class SceneStateInterface implements LoopUpdatable {
  abstract babylon: Pick<BabylonAccessor, 'scene'>
  abstract useCamera(camera: CameraConstructor): void
  onStart?(): void
  onEnd?(): void
  loopUpdate?(delta: number): void
}
