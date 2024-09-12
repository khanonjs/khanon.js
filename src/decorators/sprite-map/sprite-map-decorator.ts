import { SpriteMapInterface } from './sprite-map-interface'
import { SpriteMapProps } from './sprite-map-props'

export function SpriteMap(props: SpriteMapProps): any {
  return function <T extends { new (...args: any[]): SpriteMapInterface }>(constructor: T & SpriteMapInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor {
      props = props
    }
    return _class
  }
}
