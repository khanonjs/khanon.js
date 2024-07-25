import 'reflect-metadata'

import * as BABYLON from '@babylonjs/core'

import { ActorActionInterface as UserActorActionInterface } from '../../../'
import { ActorActionsController } from '../../../controllers'
import { Core } from '../../../core'
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
import { ActorStateInterface } from '../actor-state/actor-state-interface'
import { ActorActionCore } from './actor-action-core'
import { ActorActionInterface } from './actor-action-interface'
import { ActorActionProps } from './actor-action-props'

export function ActorAction(props: ActorActionProps = {}): any {
  return function <T extends { new (...args: any[]): ActorActionInterface }>(constructorOrTarget: (T & ActorActionInterface) | any, contextOrMethod: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const decorateClass = () => {
      const _classInterface = class extends constructorOrTarget implements ActorActionInterface {
        constructor(readonly actor: ActorInterface) {
          super()
        }

        props = props

        onPlay?(): void
        onSetup?(): void
        onStop?(): void
        onLoopUpdate?(delta: number): void
        onCanvasResize?(size: Rect): void

        countFramesUpdate$?: BABYLON.Observer<number>
        countFrames = 0
        loopUpdate$?: BABYLON.Observer<number>
        canvasResize$?: BABYLON.Observer<Rect>
        setup: any

        set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
        get loopUpdate(): boolean { return !!this.loopUpdate$ }

        start(): void {
          if (this.props.countFrames) {
            this.countFramesUpdate$ = Core.loopUpdateAddObserver((delta: number) => {
              this.countFrames += delta
              if (this.countFrames > this.props.countFrames) {
                this.countFramesUpdate$.remove()
                this.countFramesUpdate$ = undefined
                this.countFrames = 0
                this.stop()
              }
            })
          }
          invokeCallback(this.onPlay, this)
          attachLoopUpdate(this)
          attachCanvasResize(this)
        }

        end(): void {
          removeLoopUpdate(this)
          removeCanvasResize(this)
          invokeCallback(this.onStop, this)
        }

        stop(): void {
          this.actor.stopActionFromInstance(this)
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

    // Mutates decorator to class or property
    if (constructorOrTarget.prototype) {
      return decorateClass()
    } else if ((
      constructorOrTarget instanceof ActorStateInterface ||
      constructorOrTarget instanceof ActorInterface
    ) && descriptor) { // Defined descriptor means it is a method
      @ActorAction(props)
      class _actionInterface extends UserActorActionInterface {
        onLoopUpdate = descriptor.value
      }

      if (!Reflect.hasMetadata('metadata', constructorOrTarget)) {
        Reflect.defineMetadata('metadata', new ActorMetadata(), constructorOrTarget)
      }
      const metadata = Reflect.getMetadata('metadata', constructorOrTarget) as ActorMetadata
      metadata.actions.push({
        methodName: contextOrMethod as string,
        classDefinition: _actionInterface
      })
    } else {
      Logger.debugError('Cannot apply action decorator to non allowed method class:', constructorOrTarget, contextOrMethod)
    }
  }
}
