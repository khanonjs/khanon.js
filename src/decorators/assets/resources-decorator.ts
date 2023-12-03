import { ResourcesCore } from './resources-core'
import { ResourcesProps } from './resources-props'

export function Resources(props: ResourcesProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & ResourcesCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements ResourcesCore {
      props = props
    }
    // const resources = new _class()
    return _class
  }
}
