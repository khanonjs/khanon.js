import { ActionCore } from './action-core'
import { ActionProps } from './action-props'

/**
 *
 * @param props Diferenciate from BabylonJs.actionManager: https://doc.babylonjs.com/features/featuresDeepDive/events/actions
 * @returns
 */
export function Action(props: ActionProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & ActionCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements ActionCore {
      props = props
    }
    return _class
  }
}
