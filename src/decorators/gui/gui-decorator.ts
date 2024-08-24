import { GUICore } from './gui-core'
import { GUIProps } from './gui-props'
import { GUIType } from './gui-type'

export function GUI(props: GUIProps): any {
  return function <T extends { new (...args: any[]): GUIType }>(constructor: T & GUIType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements GUICore {
      props = props
    }
    return _class
  }
}
