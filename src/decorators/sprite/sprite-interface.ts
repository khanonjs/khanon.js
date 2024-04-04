import { BabylonContainer } from '../../models'

export abstract class SpriteInterface {
  abstract babylon: Pick<BabylonContainer, 'spriteManager' | 'scene'>
  onLoaded?(sceneName: string): void
}
