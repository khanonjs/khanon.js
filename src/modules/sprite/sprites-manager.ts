import * as Misc from '../../misc'
import { AssetsManager } from '../assets-manager/assets-manager'
import { Sprite } from './sprite'

export class SpritesManager {
  private readonly sprites: Misc.KeyValue<Sprite, void> = new Misc.KeyValue<Sprite, void>()

  constructor(private readonly assetsManager: AssetsManager) {}

  addSprite(sprite: Sprite): Sprite {
    sprite.setTexture(this.assetsManager.getSpriteTexture({ id: sprite.properties.textureId }))
    this.sprites.add(sprite)
    return sprite
  }

  removeSprite(sprite: Sprite): void {
    sprite.release()
    this.sprites.del(sprite)
  }

  release(): void {
    const sprites = [...this.sprites.getKeys()]
    sprites.forEach((sprite) => {
      sprite.release()
    })
    this.sprites.reset()
  }
}
