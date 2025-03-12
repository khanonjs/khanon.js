import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../../base'
import { Core } from '../../../base/core/core'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import {
  ActorsController,
  MeshesController,
  ParticlesController,
  SceneStatesController,
  SpritesController
} from '../../../controllers'
import { Rect } from '../../../models/rect'
import { Timeout } from '../../../models/timeout'
import { Logger } from '../../../modules/logger'
import { FlexId } from '../../../types/flex-id'
import {
  attachCanvasResize,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../../utils/utils'
import { CameraConstructor } from '../../camera/camera-constructor'
import { CameraInterface } from '../../camera/camera-interface'
import { GUIConstructor } from '../../gui/gui-constructor'
import { GUIInterface } from '../../gui/gui-interface'
import { SceneInterface } from '../scene-interface'
import { SceneRemove } from '../scene-remove'
import { SceneSpawn } from '../scene-spawn'
import { SceneStateConstructor } from './scene-state-constructor'
import { SceneStateCore } from './scene-state-core'
import { SceneStateInterface } from './scene-state-interface'
import { SceneStateProps } from './scene-state-props'

export function SceneState(props: SceneStateProps = {}): any {
  return function <T extends { new (...args: any[]): SceneStateInterface }>(constructor: T & SceneStateInterface, context: ClassDecoratorContext) {
    const className = constructor.name
    const _classInterface = class extends constructor implements SceneStateInterface {
      constructor(readonly scene: SceneInterface, props: SceneStateProps) {
        super()
        this._props = props
        if (this.scene) {
          this._spawn = this.scene.spawn
          this._remove = this.scene.remove
          this._metadata.applyProps(this)
        }
      }

      getClassName(): string { return className }

      setTimeout(func: () => void, ms: number): Timeout { return Core.setTimeout(func, ms, this) }
      setInterval(func: () => void, ms: number): Timeout { return Core.setInterval(func, ms, this) }
      clearTimeout(timeout: Timeout): void { Core.clearTimeout(timeout) }
      clearInterval(interval: Timeout): void { Core.clearTimeout(interval) }
      clearAllTimeouts(): void { Core.clearAllTimeoutsByContext(this) }

      _props: SceneStateProps
      setup: any
      _loopUpdate = true
      _loopUpdate$: BABYLON.Observer<number>
      _canvasResize$: BABYLON.Observer<Rect>
      _spawn: SceneSpawn
      _remove: SceneRemove
      _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()

      set loopUpdate(value: boolean) {
        this._loopUpdate = value
        switchLoopUpdate(this._loopUpdate, this)
      }

      get loopUpdate(): boolean { return this._loopUpdate }

      get spawn(): SceneSpawn { return this._spawn }
      get remove(): SceneRemove { return this._remove }

      showGUI<G extends GUIInterface>(gui: GUIConstructor, setup: any): G {
        return this.scene.showGUI(gui, setup)
      }

      hideGUI(gui: GUIConstructor): void {
        this.scene.hideGUI(gui)
      }

      getGUI<G extends GUIInterface>(gui: GUIConstructor): G | undefined {
        return this.scene.getGUI(gui)
      }

      switchCamera(camera: CameraConstructor, setup: any): void {
        this.scene.switchCamera(camera, setup)
      }

      getCamera<C extends CameraInterface = CameraInterface>(): C {
        return this.scene.getCamera()
      }

      switchState(state: SceneStateConstructor, setup: any): void {
        this.scene.switchState(state, setup)
      }

      _start(setup: any): void {
        Logger.debug('SceneState start', this.getClassName(), this.scene.getClassName())
        this.setup = setup
        invokeCallback(this.onStart, this)
        switchLoopUpdate(this._loopUpdate, this)
        attachCanvasResize(this)
      }

      _end(): void {
        removeLoopUpdate(this)
        removeCanvasResize(this)
        invokeCallback(this.onEnd, this)
        this.clearAllTimeouts()
      }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this._metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }
    }
    const _classCore = class implements SceneStateCore {
      props = props
      Instance: SceneStateInterface = new _classInterface(null as any, null as any)

      spawn(scene: SceneInterface): SceneStateInterface {
        const state = new _classInterface(scene, this.props)
        return state
      }

      load(scene: SceneInterface): LoadingProgress {
        return new LoadingProgress().fromNodes([
          ActorsController.load(this.props.actors, scene),
          SpritesController.load(this.props.sprites, scene),
          SpritesController.load(this.Instance._metadata?.getProps().sprites, scene),
          MeshesController.load(this.props.meshes, scene),
          MeshesController.load(this.Instance._metadata?.getProps().meshes, scene),
          ParticlesController.load(this.props.particles, scene),
          ParticlesController.load(this.Instance._metadata?.getProps().particles, scene)
        ])
      }

      unload(scene: SceneInterface): void {
        ActorsController.unload(this.props.actors, scene)
        SpritesController.unload(this.props.sprites, scene)
        SpritesController.unload(this.Instance._metadata?.getProps().sprites, scene)
        MeshesController.unload(this.props.meshes, scene)
        MeshesController.unload(this.Instance._metadata?.getProps().meshes, scene)
        ParticlesController.unload(this.props.particles, scene)
        ParticlesController.unload(this.Instance._metadata?.getProps().particles, scene)
      }

      getClassName(): string {
        return className
      }
    }
    SceneStatesController.register(new _classCore())
    return _classInterface
  }
}
