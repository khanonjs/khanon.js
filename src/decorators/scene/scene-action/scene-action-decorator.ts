import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../../base'
import { Core } from '../../../base/core/core'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import {
  MeshesController,
  ParticlesController,
  SceneActionsController,
  SpritesController
} from '../../../controllers'
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
import { SceneStateInterface } from '../scene-state/scene-state-interface'
import { SceneActionCore } from './scene-action-core'
import { SceneActionInterface } from './scene-action-interface'
import { SceneActionProps } from './scene-action-props'

export function SceneAction(props: SceneActionProps = {}): any {
  return function <T extends { new (...args: any[]): SceneActionInterface }>(constructorOrTarget: (T & SceneActionInterface) | any, contextOrMethod: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const decorateClass = () => {
      const _classInterface = class extends constructorOrTarget implements SceneActionInterface {
        constructor(readonly scene: SceneInterface) {
          super()
          this.metadata.applyProps(this)
        }

        props = props
        metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
        _loopUpdate: boolean
        loopUpdate$: BABYLON.Observer<number>
        canvasResize$: BABYLON.Observer<Rect>
        setup: any

        set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
        get loopUpdate(): boolean { return this._loopUpdate }

        start(setup: any): void {
          this.setup = setup
          if (this.props.countFrames) {
            this.countFramesUpdate$ = Core.loopUpdateAddObserver((delta: number) => {
              this.countFrames += delta
              if (this.countFrames > (this.props.countFrames as any)) {
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

        play(): void {
          this.scene.playActionFromInstance(this)
        }

        stop(): void {
          this.scene.stopActionFromInstance(this)
        }

        remove(): void {
          this.scene.stopActionFromInstance(this, true)
        }
      }
      const _classCore = class implements SceneActionCore {
        props = props
        Instance: SceneActionInterface = new _classInterface(null as any)

        load(scene: SceneInterface): LoadingProgress {
          return new LoadingProgress().fromNodes([
            SpritesController.load(this.props.sprites, scene),
            SpritesController.load(this.Instance.metadata.getProps().sprites, scene),
            MeshesController.load(this.props.meshes, scene),
            MeshesController.load(this.Instance.metadata.getProps().meshes, scene),
            ParticlesController.load(this.props.particles, scene),
            ParticlesController.load(this.Instance.metadata.getProps().particles, scene)
          ])
        }

        unload(scene: SceneInterface): void {
          SpritesController.unload(this.props.sprites, scene)
          SpritesController.unload(this.Instance.metadata.getProps().sprites, scene)
          MeshesController.unload(this.props.meshes, scene)
          MeshesController.unload(this.Instance.metadata.getProps().meshes, scene)
          ParticlesController.unload(this.props.particles, scene)
          ParticlesController.unload(this.Instance.metadata.getProps().particles, scene)
        }

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
      abstract class _actionInterface extends SceneActionInterface {
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
