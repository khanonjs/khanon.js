import { MeshCore } from './mesh-core'
import { MeshProps } from './mesh-props'

export function Mesh(props: MeshProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & MeshCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements MeshCore {
      props = props
    }
    // const mesh = new _class()
    return _class
  }
}
