import { MeshCore } from './mesh-core'
import { MeshProps } from './mesh-props'
import { MeshType } from './mesh-type'

export function Mesh(props: MeshProps): any {
  return function <T extends { new (...args: any[]): MeshType }>(constructor: T & MeshType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements MeshCore {
      props = props
    }
    // const mesh = new _class()
    return _class
  }
}
