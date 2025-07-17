import { Observer } from '@babylonjs/core/Misc/observable'

import { LoadingProgress } from '../../../base'
import { Core } from '../../../base/core/core'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import {
  MeshesController,
  ParticlesController,
  SceneActionsController,
  SoundsController,
  SpritesController
} from '../../../controllers'
import { BabylonAccessor } from '../../../models/babylon-accessor'
import { Rect } from '../../../models/rect'
import { Timeout } from '../../../models/timeout'
import {
  attachCanvasResize,
  invokeCallback,
  switchLoopUpdate
} from '../../../utils/utils'
import { SceneInterface } from '../scene-interface'
import { SceneActionCore } from './scene-action-core'
import { SceneActionInterface } from './scene-action-interface'
import { SceneActionProps } from './scene-action-props'

export function SceneAction(props: SceneActionProps = {}): any {
  return function <T extends { new (...args: any[]): SceneActionInterface }>(constructorOrTarget: (T & SceneActionInterface) | any, contextOrMethod: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const className = constructorOrTarget.name

    const _classInterface = class extends constructorOrTarget implements SceneActionInterface {
      constructor(readonly scene: SceneInterface) {
        super()
        if (this.scene) {
          this.babylon.scene = this.scene.babylon.scene
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
      _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null as any }
      _loopUpdate = true
      _loopUpdate$: Observer<number>
      _canvasResize$: Observer<Rect>
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

      _load(scene: SceneInterface): LoadingProgress {
        return new LoadingProgress().fromNodes([
          SpritesController.load(this.props.sprites, scene),
          SpritesController.load(this.Instance._metadata.getProps().sprites, scene),
          MeshesController.load(this.props.meshes, scene),
          MeshesController.load(this.Instance._metadata.getProps().meshes, scene),
          ParticlesController.load(this.props.particles, scene),
          ParticlesController.load(this.Instance._metadata.getProps().particles, scene),
          SoundsController.load(this.Instance._metadata.getProps().sounds, null)
        ])
      }

      _unload(scene: SceneInterface): void {
        SpritesController.unload(this.props.sprites, scene)
        SpritesController.unload(this.Instance._metadata.getProps().sprites, scene)
        MeshesController.unload(this.props.meshes, scene)
        MeshesController.unload(this.Instance._metadata.getProps().meshes, scene)
        ParticlesController.unload(this.props.particles, scene)
        ParticlesController.unload(this.Instance._metadata.getProps().particles, scene)
        SoundsController.unload(this.Instance._metadata.getProps().sounds, null)
      }

      spawn(scene: SceneInterface): SceneActionInterface {
        const action = new _classInterface(scene)
        return action
      }

      getClassName(): string {
        return className
      }
    }
    SceneActionsController.register(_classInterface, new _classCore())
    return _classInterface
  }
}
