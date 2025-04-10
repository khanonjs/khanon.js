import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../../base'
import { Core } from '../../../base/core/core'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import {
  ActorActionsController,
  MeshesController,
  ParticlesController,
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
import { SceneInterface } from '../../scene/scene-interface'
import { ActorInterface } from '../actor-interface'
import { ActorStateInterface } from '../actor-state/actor-state-interface'
import { ActorActionCore } from './actor-action-core'
import { ActorActionInterface } from './actor-action-interface'
import { ActorActionProps } from './actor-action-props'

export function ActorAction(props: ActorActionProps = {}): any {
  return function <T extends { new (...args: any[]): ActorActionInterface }>(constructorOrTarget: (T & ActorActionInterface), contextOrMethod: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const className = constructorOrTarget.name
    const decorateClass = () => {
      const _classInterface = class extends constructorOrTarget implements ActorActionInterface {
        constructor(readonly actor: ActorInterface) {
          super()
          if (this.actor) {
            this.babylon.scene = this.actor.babylon.scene
            this._metadata.applyProps(this, this.scene)
          }
        }

        getClassName(): string { return this._className ?? className }

        setTimeout(func: () => void, ms: number): Timeout { return Core.setTimeout(func, ms, this) }
        setInterval(func: () => void, ms: number): Timeout { return Core.setInterval(func, ms, this) }
        clearTimeout(timeout: Timeout): void { Core.clearTimeout(timeout) }
        clearInterval(interval: Timeout): void { Core.clearInterval(interval) }
        clearAllTimeouts(): void { Core.clearAllTimeoutsByContext(this) }

        _props = props
        _className: string
        babylon: Pick<BabylonAccessor, 'scene'> = { scene: null as any }
        scene: SceneInterface
        _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
        _countFramesUpdate$: BABYLON.Observer<number> | null = null
        _countFrames = 0
        _loopUpdate$: BABYLON.Observer<number>
        _canvasResize$: BABYLON.Observer<Rect>
        setup: any
        _loopUpdate = true
        _isPlaying = false

        set loopUpdate(value: boolean) {
          this._loopUpdate = value
          switchLoopUpdate(this._loopUpdate, this)
        }

        get loopUpdate(): boolean { return this._loopUpdate }

        get isPlaying(): boolean { return this._isPlaying }

        _start(setup: any): void {
          this.scene = this.actor.scene
          this.setup = setup
          this._isPlaying = true
          if (this._props.countFrames) {
            this._countFramesUpdate$ = Core.loopUpdateAddObserver((delta: number) => {
              this._countFrames += delta
              if (this._countFrames > (this._props.countFrames as any)) {
                this._countFramesUpdate$?.remove()
                this._countFramesUpdate$ = null
                this._countFrames = 0
                this.stop()
              }
            })
          }
          switchLoopUpdate(this._loopUpdate, this)
          attachCanvasResize(this)
          invokeCallback(this.onPlay, this)
        }

        play(): void {
          if (!this._props.preserve) { Logger.debugError('Cannot play an action which is not preserved in context.', this.getClassName()) }
          if (!this.isPlaying) {
            this._isPlaying = true
            switchLoopUpdate(this._loopUpdate, this)
            attachCanvasResize(this)
            invokeCallback(this.onPlay, this)
          }
        }

        stop(): void {
          this.actor._stopActionFromInstance(this)
        }

        remove(): void {
          this._isPlaying = false
          this.actor._stopActionFromInstance(this, true)
        }
      }
      const _classCore = class implements ActorActionCore {
        props = props
        Instance: ActorActionInterface = new _classInterface(null as any)

        _load(scene: SceneInterface): LoadingProgress {
          return new LoadingProgress().fromNodes([
            SpritesController.load(this.props.sprites, scene),
            SpritesController.load(this.Instance._metadata.getProps().sprites, scene),
            MeshesController.load(this.props.meshes, scene),
            MeshesController.load(this.Instance._metadata.getProps().meshes, scene),
            ParticlesController.load(this.props.particles, scene),
            ParticlesController.load(this.Instance._metadata.getProps().particles, scene)
          ])
        }

        _unload(scene: SceneInterface): void {
          SpritesController.unload(this.props.sprites, scene)
          SpritesController.unload(this.Instance._metadata.getProps().sprites, scene)
          MeshesController.unload(this.props.meshes, scene)
          MeshesController.unload(this.Instance._metadata.getProps().meshes, scene)
          ParticlesController.unload(this.props.particles, scene)
          ParticlesController.unload(this.Instance._metadata.getProps().particles, scene)
        }

        spawn(actor: ActorInterface): ActorActionInterface {
          const action = new _classInterface(actor)
          return action
        }

        getClassName(): string {
          return className
        }
      }
      ActorActionsController.register(new _classCore())
      return _classInterface
    }

    // Mutates decorator to class or property
    if (constructorOrTarget.prototype) {
      return decorateClass()
    } else if (/* ( // TODO remove this?
      constructorOrTarget instanceof ActorStateInterface ||
      constructorOrTarget instanceof ActorInterface
    ) && */descriptor) { // Defined descriptor means it is a method
      @ActorAction(props)
      abstract class _actionInterface extends ActorActionInterface {
        _className = contextOrMethod as any
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
      Logger.debugError('Cannot apply action decorator to a method.', constructorOrTarget, contextOrMethod)
    }
  }
}
