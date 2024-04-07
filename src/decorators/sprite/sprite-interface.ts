import { BabylonContainer } from '../../models'
import { SceneInterface } from '../scene/scene-interface'

export abstract class SpriteInterface {
  abstract babylon: Pick<BabylonContainer, 'spriteManager' | 'scene'>
  onLoaded?(scene: SceneInterface): void
}
