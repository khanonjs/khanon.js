import { StateCore } from './state-core'
import { StateProps } from './state-props'

export function State(props: StateProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & StateCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements StateCore {
      props = props
    }
    return _class
  }
}
