import { MeshMapCore } from './meshmap-core'
import { MeshMapInterface } from './meshmap-interface'
import { MeshMapProps } from './meshmap-props'

export function MeshMap(props: MeshMapProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & MeshMapCore & MeshMapInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor {
      props = props
    }
    return _class
  }
}
