import { BabylonAccessor } from '../../models'
import { SceneInterface } from '../scene/scene-interface'

export abstract class SpriteInterface {
  abstract babylon: Pick<BabylonAccessor, 'spriteManager' | 'scene'>
  onLoaded?(scene: SceneInterface): void
}
