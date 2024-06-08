import { LoopUpdatable } from '../../base'
import { CameraConstructor } from '../../constructors'
import { BabylonAccessor } from '../../models'
import { SceneType } from '../scene/scene-type'

export class SceneStateInterface implements LoopUpdatable {
  babylon: Pick<BabylonAccessor, 'scene'>
  setCamera?(camera: CameraConstructor): void
  start?(scene: SceneType): void
  end?(scene: SceneType): void
  onStart?(): void
  onEnd?(): void
  loopUpdate?(delta: number): void
}
