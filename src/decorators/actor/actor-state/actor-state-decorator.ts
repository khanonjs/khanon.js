import { Observer } from '@babylonjs/core'

import { ActorStatesController } from '../../../controllers'
import { Rect } from '../../../models/rect'
import { Logger } from '../../../modules/logger'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../../utils/utils'
import { ActorInterface } from '../actor-interface'
import { ActorMetadata } from '../actor-metadata'
import { ActorStateCore } from './actor-state-core'
import { ActorStateInterface } from './actor-state-interface'
import { ActorStateProps } from './actor-state-props'

export function ActorState(props: ActorStateProps = {}): any {
  return function <T extends { new (...args: any[]): ActorStateInterface }>(constructor: T & ActorStateInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements ActorStateInterface {
      constructor(readonly actor: ActorInterface) {
        super()
        this.metadata.applyProps(this)
      }

      metadata: ActorMetadata = Reflect.getMetadata('metadata', this) ?? new ActorMetadata()
      loopUpdate$?: Observer<number>
      canvasResize$?: Observer<Rect>

      onStart?(): void
      onSetup?(): void
      onEnd?(): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(size: Rect): void

      setup: any

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }

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
