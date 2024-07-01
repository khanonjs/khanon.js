import { MeshMapProps } from './meshmap-props'
import { MeshMapType } from './meshmap-type'

export function MeshMap(props: MeshMapProps): any {
  return function <T extends { new (...args: any[]): MeshMapType }>(constructor: T & MeshMapType, context: ClassDecoratorContext) {
    const _class = class extends constructor {
      props = props
    }
    return _class
  }
}
