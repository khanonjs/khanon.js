import { ActorCore } from './actor-core'
import { ActorProps } from './actor-props'

export function Actor(props: ActorProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & ActorCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements ActorCore {
      props = props
    }
    // const actor = new _class()
    return _class
  }
}
