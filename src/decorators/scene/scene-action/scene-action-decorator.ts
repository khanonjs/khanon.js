import 'reflect-metadata'

import * as BABYLON from '@babylonjs/core'

import { SceneActionInterface as UserSceneActionInterface } from '../../..'
import { SceneActionsController } from '../../../controllers'
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
import { SceneInterface } from '../scene-interface'
import { SceneMetadata } from '../scene-metadata'
import { SceneStateInterface } from '../scene-state/scene-state-interface'
import { SceneInterface } from '../scene-type'
import { SceneActionCore } from './scene-action-core'
import { SceneActionInterface } from './scene-action-interface'
import { SceneActionProps } from './scene-action-props'

export function SceneAction(props: SceneActionProps = {}): any {
  return function <T extends { new (...args: any[]): SceneActionInterface }>(constructorOrTarget: (T & SceneActionInterface) | any, contextOrMethod: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const decorateClass = () => {
      const _classInterface = class extends constructorOrTarget implements SceneActionInterface {
        constructor(readonly scene: SceneInterface) {
          super()
        }

        props = props

        onStart?(): void
        onSetup?(): void
        onStop?(): void
        onLoopUpdate?(delta: number): void
        onCanvasResize?(size: Rect): void

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
          invokeCallback(this.onStart, this)
          attachLoopUpdate(this)
          attachCanvasResize(this)
        }

        end(): void {
          removeLoopUpdate(this)
          removeCanvasResize(this)
          invokeCallback(this.onStop, this)
        }

        stop(): void {
          this.scene.stopActionFromInstance(this)
        }
      }
      const _classCore = class implements SceneActionCore {
        props = props
        Instance: SceneActionInterface = new _classInterface(null)

        spawn(scene: SceneInterface): SceneActionInterface {
          const action = new _classInterface(scene)
          return action
        }
      }
      SceneActionsController.register(new _classCore())
      return _classInterface
    }

    // Mutates decorator to class or property
    if (constructorOrTarget.prototype) {
      return decorateClass()
    } else if ((
      constructorOrTarget instanceof SceneStateInterface ||
      constructorOrTarget instanceof SceneInterface
    ) && descriptor) { // Defined descriptor means it is a method
      @SceneAction(props)
      class _actionInterface extends UserSceneActionInterface {
        onLoopUpdate = descriptor.value
      }

      if (!Reflect.hasMetadata('metadata', constructorOrTarget)) {
        Reflect.defineMetadata('metadata', new SceneMetadata(), constructorOrTarget)
      }
      const metadata = Reflect.getMetadata('metadata', constructorOrTarget) as SceneMetadata
      metadata.actions.push({
        methodName: contextOrMethod as string,
        classDefinition: _actionInterface
      })
    } else {
      Logger.debugError('Cannot apply action decorator to non allowed method class:', constructorOrTarget, contextOrMethod)
    }
  }
}
