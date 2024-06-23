import { Observer } from '@babylonjs/core'

import { ActorStatesController } from '../../../controllers'
import { cloneClass } from '../../../utils/utils'
import { ActorInterface } from '../actor-interface'
import { ActorStateCore } from './actor-state-core'
import { ActorStateInterface } from './actor-state-interface'
import { ActorStateProps } from './actor-state-props'

export function ActorState(props: ActorStateProps): any {
  return function <T extends { new (...args: any[]): ActorStateInterface }>(constructor: T & ActorStateInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements ActorStateInterface {
      // Private
      props = props
      actor: ActorInterface
      loopUpdate$: Observer<number>

      start(actor: ActorInterface): void {

      }

      end(): void {

      }

      // User defined
      onStart?(): void
      onEnd?(): void
      loopUpdate?(delta: number): void
    }
    const _classCore = class implements ActorStateCore {
      props = props
      Instance: ActorStateInterface = new _classInterface()

      spawn(): ActorStateInterface {
        return cloneClass(this.Instance)
      }
    }
    ActorStatesController.register(new _classCore())
    return _classInterface
  }
}
