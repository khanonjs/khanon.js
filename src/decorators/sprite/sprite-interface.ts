import { BabylonContainer } from '../../models'

export class SpriteInterface {
  babylon: Pick<BabylonContainer, 'spriteManager'>
  onLoaded?(): void
}
