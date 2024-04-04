import { StateCore } from './state-core'
import { StateProps } from './state-props'
import { StateType } from './state-type'

export function State(props: StateProps): any {
  return function <T extends { new (...args: any[]): StateType }>(constructor: T & StateType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements StateCore {
      props = props
    }
    return _class
  }
}
