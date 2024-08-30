import 'reflect-metadata'

import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import {
  ActorActionsController,
  MeshesController,
  SpritesController
} from '../../../controllers'
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
import { SceneInterface } from '../../scene/scene-interface'
import { ActorInterface } from '../actor-interface'
import { ActorStateInterface } from '../actor-state/actor-state-interface'
import { ActorActionCore } from './actor-action-core'
import { ActorActionInterface } from './actor-action-interface'
import { ActorActionProps } from './actor-action-props'

export function ActorAction(props: ActorActionProps = {}): any {
  return function <T extends { new (...args: any[]): ActorActionInterface }>(constructorOrTarget: (T & ActorActionInterface), contextOrMethod: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const decorateClass = () => {
      const _classInterface = class extends constructorOrTarget implements ActorActionInterface {
        constructor(actor: ActorInterface) {
          super()
          this.actor = actor
          this.metadata.applyProps(this)
        }

        props = props
        actor: ActorInterface
        scene: SceneInterface
        metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
        countFramesUpdate$: BABYLON.Observer<number>
        countFrames = 0
        loopUpdate$: BABYLON.Observer<number>
        canvasResize$: BABYLON.Observer<Rect>
        setup: any

        set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
        get loopUpdate(): boolean { return !!this.loopUpdate$ }

        start(setup: any): void {
          this.scene = this.actor.scene
          this.setup = setup
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
          attachLoopUpdate(this)
          attachCanvasResize(this)
          invokeCallback(this.onPlay, this)
        }

        stop(): void {
          this.actor.stopActionFromInstance(this)
        }

        remove(): void {
          this.actor.stopActionFromInstance(this, true)
        }
      }
      const _classCore = class implements ActorActionCore {
        props = props
        Instance: ActorActionInterface = new _classInterface(null)

        load(scene: SceneInterface): LoadingProgress {
          const progress = new LoadingProgress().complete()
          SpritesController.load(this.props.sprites, scene)
          SpritesController.load(this.Instance.metadata.getProps().sprites, scene)
          MeshesController.load(this.props.meshes, scene)
          MeshesController.load(this.Instance.metadata.getProps().meshes, scene)
          return progress
        }

        unload(scene: SceneInterface): void {
          SpritesController.unload(this.props.sprites, scene)
          SpritesController.unload(this.Instance.metadata.getProps().sprites, scene)
          MeshesController.unload(this.props.meshes, scene)
          MeshesController.unload(this.Instance.metadata.getProps().meshes, scene)
        }

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
      abstract class _actionInterface extends ActorActionInterface {
        onLoopUpdate = descriptor.value
      }

      if (!Reflect.hasMetadata('metadata', constructorOrTarget)) {
        Reflect.defineMetadata('metadata', new Metadata(), constructorOrTarget)
      }
      const metadata = Reflect.getMetadata('metadata', constructorOrTarget) as Metadata
      metadata.actions.push({
        methodName: contextOrMethod as string,
        classDefinition: _actionInterface
      })
    } else {
      Logger.debugError('Cannot apply action decorator to non allowed method class:', constructorOrTarget, contextOrMethod)
    }
  }
}
