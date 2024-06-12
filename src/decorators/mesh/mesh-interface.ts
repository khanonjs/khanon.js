import { BabylonAccessor } from '../../models'
import { SceneInterface } from '../scene/scene-interface'

export abstract class MeshInterface {
  abstract babylon: Pick<BabylonAccessor, 'scene'>
  onLoaded?(scene: SceneInterface): void
}
