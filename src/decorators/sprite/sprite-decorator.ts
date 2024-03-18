import { SpriteCore } from './sprite-core'
import { SpriteProps } from './sprite-props'
import { SpriteTexture } from './sprite-texture'

export function Sprite(props: SpriteProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & SpriteCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SpriteCore {
      props = props
      texture: SpriteTexture
    }
    // const sprite = new _class()
    return _class
  }
}
