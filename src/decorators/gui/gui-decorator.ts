import { GUICore } from './gui-core'
import { GUIProps } from './gui-props'

export function GUI(props: GUIProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & GUICore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements GUICore {
      props = props
    }
    return _class
  }
}
