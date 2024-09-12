import { MeshMapInterface } from './mesh-map-interface'
import { MeshMapProps } from './mesh-map-props'

export function MeshMap(props: MeshMapProps): any {
  return function <T extends { new (...args: any[]): MeshMapInterface }>(constructor: T & MeshMapInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor {
      props = props
    }
    return _class
  }
}
