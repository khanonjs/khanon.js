// 8a8f
import '@babylonjs/inspector'
import '@babylonjs/core/Debug/debugLayer'

import { Observer } from '@babylonjs/core'
import { Scene as BabylonScene } from '@babylonjs/core/scene'

import { LoadingProgress } from '../../base'
import {
  ActorConstructor,
  CameraConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  SceneStateConstructor
} from '../../constructors'
import {
  ActorsController,
  AssetsController,
  CamerasController,
  ScenesController,
  SceneStatesController
} from '../../controllers'
import { Core } from '../../core'
import {
  invokeCallback,
  removeArrayDuplicitiesInObject
} from '../../helpers/utils'
import KJS from '../../kjs'
import {
  AssetDefinition,
  BabylonAccessor,
  Rect
} from '../../models'
import { Logger } from '../../modules'
import { ActorInterface } from '../actor/actor-interface'
import { SceneCore } from './scene-core'
import { SceneInterface } from './scene-interface'
import { SceneProps } from './scene-props'
import { SceneType } from './scene-type'

// 8a8f can those methods be added to index.d.ts decorator declaration?
// Should be they added to scene-interface in declaration file?
// Should the methods be added to the function return as a type?

export function Scene(props: SceneProps): any {
  return function <T extends { new (...args: any[]): SceneType }>(constructor: T & SceneType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SceneCore, SceneInterface {
      // Core
      props = removeArrayDuplicitiesInObject(props)
      protected _assets: AssetDefinition[]
      protected _loaded: boolean
      protected _started: boolean

      setEngineParams(): void {}
      renderStart(id: string): void {}
      renderStop(id: string): void {}

      // Interface
      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null }
      loopUpdate$: Observer<number>
      canvasResize$: Observer<Rect>
      get assets(): AssetDefinition[] { return this._assets }
      get loaded(): boolean { return this._loaded }
      get started(): boolean { return this._started }

      onStart?(): void
      onStop?(): void
      onLoaded?(): void
      onUnload?(): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(canvasSize: Rect): void

      start(state: SceneStateConstructor): void {
        Logger.debug('Scene start', _class.prototype)
        Core.startRenderScene(this)
        this._started = true
        this.startState(state)
        invokeCallback(this.onStart, this)
        if (this.onLoopUpdate) {
          this.loopUpdate$ = Core.addLoopUpdateObserver(this.onLoopUpdate.bind(this))
        }
        if (this.onCanvasResize) {
          this.canvasResize$ = Core.addCanvasResizeObserver(this.onCanvasResize.bind(this))
        }
      }

      stop(): void {
        Logger.debug('Scene stop', _class.prototype)
        Core.stopRenderScene(this)
        if (this.loopUpdate$) {
          Core.removeLoopUpdateObserver(this.loopUpdate$)
          this.loopUpdate$ = undefined
        }
        if (this.canvasResize$) {
          Core.removeCanvasResizeObserver(this.canvasResize$)
          this.canvasResize$ = undefined
        }
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
        camera.babylon.camera = camera.initialize(this.babylon.scene)
        camera.babylon.camera.attachControl(Core.canvas, true)
      }

      startState(state: SceneStateConstructor): void {
        if (!this.props.states.find(_state => _state === state)) {
          Logger.error('Trying to set a state non available to the scene. Please check the scene props.', _class.prototype, state.prototype)
        } else {
          SceneStatesController.get(state).spawn(this).start()
        }
      }

      spawnActor(actor: ActorConstructor, initialize?: (actor: ActorInterface) => void): void {
        const actorInstance = ActorsController.get(actor).spawn(this)
        invokeCallback(initialize, this, actorInstance)
      }

      spawnParticle(particle: ParticleConstructor, initialize?: (particle: ParticleConstructor) => void): void {

      }

      spawnParticleSource(particleSource: ParticleSourceConstructor, initialize?: (particleSource: ParticleSourceConstructor) => void): void {

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
