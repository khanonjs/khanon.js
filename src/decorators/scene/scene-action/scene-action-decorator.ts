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
import { BabylonAccessor } from '../../../models/babylon-accessor'
import { Rect } from '../../../models/rect'
import { Timeout } from '../../../models/timeout'
import { Logger } from '../../../modules/logger'
import {
  attachCanvasResize,
  invokeCallback,
  switchLoopUpdate
} from '../../../utils/utils'
import { SceneInterface } from '../scene-interface'
import { SceneStateInterface } from '../scene-state/scene-state-interface'
import { SceneActionCore } from './scene-action-core'
import { SceneActionInterface } from './scene-action-interface'
import { SceneActionProps } from './scene-action-props'

export function SceneAction(props: SceneActionProps = {}): any {
  return function <T extends { new (...args: any[]): SceneActionInterface }>(constructorOrTarget: (T & SceneActionInterface) | any, contextOrMethod: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const className = constructorOrTarget.name

    const decorateClass = () => {
      const _classInterface = class extends constructorOrTarget implements SceneActionInterface {
        constructor(readonly scene: SceneInterface) {
          super()
          if (this.scene) {
            this.babylon.scene = this.scene.babylon.scene
            this._metadata.applyProps(this)
          }
        }

        getClassName(): string { return this._className ?? className }

        setTimeout(func: () => void, ms: number): Timeout { return Core.setTimeout(func, ms, this) }
        setInterval(func: () => void, ms: number): Timeout { return Core.setInterval(func, ms, this) }
        clearTimeout(timeout: Timeout): void { Core.clearTimeout(timeout) }
        clearInterval(interval: Timeout): void { Core.clearInterval(interval) }
        clearAllTimeouts(): void { Core.clearAllTimeoutsByContext(this) }

        _props = props
        _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
        babylon: Pick<BabylonAccessor, 'scene'> = { scene: null as any }
        _loopUpdate = true
        _loopUpdate$: BABYLON.Observer<number>
        _canvasResize$: BABYLON.Observer<Rect>
        setup: any

        set loopUpdate(value: boolean) {
          this._loopUpdate = value
          switchLoopUpdate(this._loopUpdate, this)
        }

        get loopUpdate(): boolean { return this._loopUpdate }

        _start(setup: any): void {
          this.setup = setup
          if (this._props.countFrames) {
            this.countFramesUpdate$ = Core.loopUpdateAddObserver((delta: number) => {
              this.countFrames += delta
              if (this.countFrames > (this._props.countFrames as any)) {
                this.countFramesUpdate$.remove()
                this.countFramesUpdate$ = undefined
                this.countFrames = 0
                this.stop()
              }
            })
          }
          switchLoopUpdate(this._loopUpdate, this)
          attachCanvasResize(this)
          invokeCallback(this.onPlay, this)
        }

        play(): void {
          this.scene._playActionFromInstance(this)
        }

        stop(): void {
          this.scene._stopActionFromInstance(this)
        }

        remove(): void {
          this.scene._stopActionFromInstance(this, true)
        }
      }
      const _classCore = class implements SceneActionCore {
        props = props
        Instance: SceneActionInterface = new _classInterface(null as any)

        load(scene: SceneInterface): LoadingProgress {
          return new LoadingProgress().fromNodes([
            SpritesController.load(this.props.sprites, scene),
            SpritesController.load(this.Instance._metadata.getProps().sprites, scene),
            MeshesController.load(this.props.meshes, scene),
            MeshesController.load(this.Instance._metadata.getProps().meshes, scene),
            ParticlesController.load(this.props.particles, scene),
            ParticlesController.load(this.Instance._metadata.getProps().particles, scene)
          ])
        }

        unload(scene: SceneInterface): void {
          SpritesController.unload(this.props.sprites, scene)
          SpritesController.unload(this.Instance._metadata.getProps().sprites, scene)
          MeshesController.unload(this.props.meshes, scene)
          MeshesController.unload(this.Instance._metadata.getProps().meshes, scene)
          ParticlesController.unload(this.props.particles, scene)
          ParticlesController.unload(this.Instance._metadata.getProps().particles, scene)
        }

        spawn(scene: SceneInterface): SceneActionInterface {
          const action = new _classInterface(scene)
          return action
        }

        getClassName(): string {
          return className
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
      Logger.debugError('Cannot apply action decorator to not allowed method class:', constructorOrTarget, contextOrMethod)
    }
  }
}
