import { TextureCore } from './texture-core'
import { TextureProps } from './texture-props'

export function Texture(props: TextureProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & TextureCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements TextureCore {
      props = props
    }
    return _class
  }
}
