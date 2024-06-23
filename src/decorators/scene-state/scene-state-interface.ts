import { LoopUpdatable } from '../../base'
import { CameraConstructor } from '../../constructors'
import { BabylonAccessor } from '../../models'
import { SceneType } from '../scene/scene-type'

export class SceneStateInterface implements LoopUpdatable {
  babylon: Pick<BabylonAccessor, 'scene'>
  scene: SceneType
  setCamera?(camera: CameraConstructor): void
  play?(scene: SceneType): void
  end?(scene: SceneType): void
  onPlay?(scene: SceneType): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
}
