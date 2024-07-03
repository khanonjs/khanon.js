// 8a8f
import '@babylonjs/inspector'
import '@babylonjs/core/Debug/debugLayer'

import { Observer } from '@babylonjs/core'
import { Scene as BabylonScene } from '@babylonjs/core/scene'

import { LoadingProgress } from '../../base'
import { CameraConstructor } from '../../constructors/camera-constructor'
import { SceneStateConstructor } from '../../constructors/scene-state-constructor'
import {
  ActorsController,
  AssetsController,
  CamerasController,
  ScenesController,
  SceneStatesController
} from '../../controllers'
import { Core } from '../../core'
import KJS from '../../kjs'
import {
  AssetDefinition,
  BabylonAccessor,
  Rect
} from '../../models'
import { Logger } from '../../modules'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeArrayDuplicitiesInObject,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { CameraInterface } from '../camera/camera-interface'
import { SceneStateInterface } from '../scene-state/scene-state-interface'
import { SceneCore } from './scene-core'
import { SceneInterface } from './scene-interface'
import { SceneProps } from './scene-props'
import { SceneSpawn } from './scene-spawn'
import { SceneType } from './scene-type'

export function Scene(props: SceneProps): any {
  return function <T extends { new (...args: any[]): SceneType }>(constructor: T & SceneType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SceneCore, SceneInterface {
      constructor() {
        super()
        this._spawn = new SceneSpawn(this, _class.prototype)
      }

      props = removeArrayDuplicitiesInObject(props)
      protected _assets: AssetDefinition[]
      protected _loaded: boolean
      protected _started: boolean
      protected _state: SceneStateInterface
      protected _camera: CameraInterface
      protected _spawn: SceneSpawn

      setEngineParams(): void {}
      renderStart(id: string): void {}
      renderStop(id: string): void {}

      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null }
      loopUpdate$: Observer<number>
      canvasResize$: Observer<Rect>
      get assets(): AssetDefinition[] { return this._assets }
      get loaded(): boolean { return this._loaded }
      get started(): boolean { return this._started }
      get state(): SceneStateInterface { return this._state }
      get camera(): CameraInterface { return this._camera }
      get spawn(): SceneSpawn { return this._spawn }

      onStart?(): void
      onStop?(): void
      onLoaded?(): void
      onUnload?(): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(size: Rect): void

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }

      start(state: SceneStateConstructor): void {
        Logger.debug('Scene start', _class.prototype)
        Core.startRenderScene(this)
        this._started = true
        this.startState(state)
        invokeCallback(this.onStart, this)
        attachLoopUpdate(this)
        attachCanvasResize(this)
      }

      stop(): void {
        Logger.debug('Scene stop', _class.prototype)
        Core.stopRenderScene(this)
        removeLoopUpdate(this)
        removeCanvasResize(this)
      }

      load(): LoadingProgress {
        Logger.debug('Scene load', _class.prototype)

        // Create babylon scene and apply configuration
        this.babylon.scene = new BabylonScene(Core.engine, this.props.options)
        if (this.props.configuration) {
          for (const [key, value] of Object.entries(this.props.configuration)) {
            // 8a8f test this
            this.babylon.scene[key] = value
          }
        }

        // Babylon inspector (only DEV mode). Babylon inspector's imports are removed on webpack build.
        if (Core.isDevelopmentMode()) { // 8a8f uno por escena, permitir solo uno activo
          this.debugInspector()
        }

        const sceneProgress = new LoadingProgress()
        if (!this.assets) {
          this._assets = AssetsController.findAssetsDefinitions(this.props)
        }
        const assetsProgress = AssetsController.sceneLoad(this)

        assetsProgress.onComplete.add(() => {
          Logger.debug('Scene assets load completed', _class.prototype)
          ActorsController.load(this.props.actors, this)
          this.babylon.scene.executeWhenReady(() => {
            invokeCallback(this.onLoaded, this)
            sceneProgress.complete()
          })
        })
        assetsProgress.onError.add((error: string) => {
          Logger.debug('Scene assets load error', error, _class.prototype)
          KJS.throw(error)
        })
        assetsProgress.onProgress.add((progress: number) => {
          sceneProgress.setProgress(progress)
        })

        return sceneProgress
      }

      unload(): void {
        Logger.debug('Scene unload', _class.prototype)
      }

      setCamera(constructor: CameraConstructor): void {
        const camera = CamerasController.get(constructor).spawn()
        if (this._camera) {
          this._camera.stop()
        }
        this._camera = camera
        this._camera.babylon.camera = this._camera.initialize(this.babylon.scene)
        this._camera.babylon.camera.attachControl(Core.canvas, true)
        this._camera.start()
      }

      startState(state: SceneStateConstructor): void {
        if (!this.props.states.find(_state => _state === state)) { Logger.debugError('Trying to set a state non available to the scene. Please check the scene props.', _class.prototype, state.prototype) }
        const _state = SceneStatesController.get(state).spawn(this)
        if (this._state) {
          this._state.end()
        }
        this._state = _state
        this._state.start()
      }

      debugInspector(): void {
        // 8a8f ver qué hacer con esto
        window.addEventListener('keyup', (ev) => {
          if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'I') {
            // @ts-ignore
            if (this.babylon.scene.debugLayer.isVisible()) {
              // @ts-ignore
              this.babylon.scene.debugLayer.hide()
            } else {
              // @ts-ignore
              this.babylon.scene.debugLayer.show()
            }
          }
        })
      }
    }
    ScenesController.register(new _class())
    return _class
  }
}
