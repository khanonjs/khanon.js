import { ActorStatesController } from '../../../controllers'
import { Logger } from '../../../modules/logger'
import { ActorInterface } from '../actor-interface'
import { ActorStateCore } from './actor-state-core'
import { ActorStateInterface } from './actor-state-interface'
import { ActorStateProps } from './actor-state-props'

export function ActorState(props: ActorStateProps): any {
  return function <T extends { new (...args: any[]): ActorStateInterface }>(constructor: T & ActorStateInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements ActorStateInterface {
      constructor(readonly actor: ActorInterface) {
        super()
      }
    }
    const _classCore = class implements ActorStateCore {
      props = props
      Instance: ActorStateInterface = new _classInterface(null)

      spawn(actor: ActorInterface): ActorStateInterface {
        const state = new _classInterface(actor)
        return state
      }
    }
    ActorStatesController.register(new _classCore())
    return _classInterface
  }
}
