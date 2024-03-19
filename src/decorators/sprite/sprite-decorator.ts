import { SpritesController } from '../../controllers/sprites-controller'
import { BabylonContainer } from '../../models/babylon-container'
import { SpriteCore } from './sprite-core'
import { SpriteProps } from './sprite-props'
import { SpriteTexture } from './sprite-texture'

export function Sprite(props: SpriteProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & SpriteCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SpriteCore {
      // Core
      babylon: BabylonContainer
      props = props

      // Interface
      texture: SpriteTexture
    }
    SpritesController.register(new _class())
    return _class
  }
}
