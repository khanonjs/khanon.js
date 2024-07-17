import { Observer } from '@babylonjs/core'

import { ActorStatesController } from '../../../controllers'
import { Rect } from '../../../models/rect'
import { Logger } from '../../../modules/logger'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate
} from '../../../utils/utils'
import { ActorInterface } from '../actor-interface'
import { ActorActionCore } from './actor-action-core'
import { ActorActionInterface } from './actor-action-interface'
import { ActorActionProps } from './actor-action-props'

export function ActorAction(props: ActorActionProps = {}): any {
  return function <T extends { new (...args: any[]): ActorActionInterface }>(constructor: T & ActorActionInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements ActorActionInterface {
      constructor(readonly actor: ActorInterface) {
        super()
      }

      onStart?(): void
      onSetup?(): void
      onEnd?(): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(size: Rect): void

      loopUpdate$?: Observer<number>
      canvasResize$?: Observer<Rect>
      setup: any
      loopUpdate: boolean

      start(): void {
        Logger.debug('ActorState start', _classInterface.prototype, this.actor.constructor.prototype)
        invokeCallback(this.onStart, this)
        attachLoopUpdate(this)
        attachCanvasResize(this)
      }

      end(): void {
        removeLoopUpdate(this)
        removeCanvasResize(this)
        invokeCallback(this.onEnd, this)
      }
    }
    const _classCore = class implements ActorActionCore {
      props = props
      Instance: ActorActionInterface = new _classInterface(null)

      spawn(actor: ActorInterface): ActorActionInterface {
        const state = new _classInterface(actor)
        return state
      }
    }
    ActorStatesController.register(new _classCore())
    return _classInterface
  }
}
