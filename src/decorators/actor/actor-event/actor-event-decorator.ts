import { ActorEventCore } from './actor-event-core'
import { ActorEventProps } from './actor-event-props'

/**
 *
 * @param props Diferenciate from BabylonJs.actionManager: https://doc.babylonjs.com/features/featuresDeepDive/events/actions
 * @returns
 */
export function ActorEvent(props: ActorEventProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & ActorEventCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements ActorEventCore {
      props = props
    }
    return _class
  }
}
