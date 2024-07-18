import { Observer } from '@babylonjs/core'

import { ActorActionsController } from '../../../controllers'
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

      props = props

      onStart?(): void
      onSetup?(): void
      onStop?(): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(size: Rect): void

      loopUpdate$?: Observer<number>
      canvasResize$?: Observer<Rect>
      setup: any
      loopUpdate: boolean

      start(): void {
        Logger.debug('ActorAction start', _classInterface.prototype, this.actor.constructor.prototype)
        invokeCallback(this.onStart, this)
        attachLoopUpdate(this)
        attachCanvasResize(this)
      }

      stop(): void {
        removeLoopUpdate(this)
        removeCanvasResize(this)
        invokeCallback(this.onStop, this)
      }
    }
    const _classCore = class implements ActorActionCore {
      props = props
      Instance: ActorActionInterface = new _classInterface(null)

      spawn(actor: ActorInterface): ActorActionInterface {
        const action = new _classInterface(actor)
        return action
      }
    }
    ActorActionsController.register(new _classCore())
    return _classInterface
  }
}
