import { SceneEventCore } from './scene-event-core'
import { SceneEventProps } from './scene-event-props'

/**
 *
 * @param props Diferenciate from BabylonJs.actionManager: https://doc.babylonjs.com/features/featuresDeepDive/events/actions
 * @returns
 */
export function SceneEvent(props: SceneEventProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & SceneEventCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SceneEventCore {
      props = props
    }
    return _class
  }
}
