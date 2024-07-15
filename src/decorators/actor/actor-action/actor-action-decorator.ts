import { ActorActionsController } from '../../../controllers'
import { ActorInterface } from '../actor-interface'
import { ActorActionCore } from './actor-action-core'
import { ActorActionInterface } from './actor-action-interface'
import { ActorActionProps } from './actor-action-props'

/**
 * Diferenciate from BabylonJs.actionManager: https://doc.babylonjs.com/features/featuresDeepDive/events/actions
 * @param props
 * @returns
 */
export function ActorAction(props: ActorActionProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & ActorActionInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements ActorActionInterface {
      constructor(readonly actor: ActorInterface, readonly props: any) {
        super()
      }
    }
    const _classCore = class implements ActorActionCore {
      props = props
      Instance: ActorActionInterface = new _classInterface(null, null)

      spawn(actor: ActorInterface, props: any): ActorActionInterface {
        const actorAction = new _classInterface(actor, props)
        return actorAction
      }
    }
    ActorActionsController.register(new _classCore())
    return _classInterface
  }
}
