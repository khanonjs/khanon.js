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
  BabylonAccessor
} from '../../models'
import { Logger } from '../../modules'
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
      get assets(): AssetDefinition[] { return this._assets }
      get loaded(): boolean { return this._loaded }
      get started(): boolean { return this._started }

      start(state: SceneStateConstructor): void {
        Logger.debug('Scene start', _class.prototype)
        Core.startRenderScene(this)
        this._started = true
        this.setState(state)
        invokeCallback(this.onStart, this)
      }

      stop(): void {
        Logger.debug('Scene stop', _class.prototype)
        Core.stopRenderScene(this)
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
        if (Core.isDevelopmentMode()) {
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

      setCamera(camera: CameraConstructor): void {

      }

      setState(state: SceneStateConstructor): void {
        if (!this.props.states.find(_state => _state === state)) {
          Logger.error('Trying to set a state non added to the scene. Please check he scene props.', _class.prototype, state.prototype)
        } else {
          SceneStatesController.get(state).spawn().start(this)
        }
      }

      spawn(entity: ActorConstructor | ParticleConstructor | ParticleSourceConstructor): void {

      }

      debugInspector(): void {
        window.addEventListener('keydown', (ev) => {
          if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'I') {
            // 8a8f
            /*
            // @ts-ignore
            if (this.babylonjs.debugLayer.isVisible()) {
              // @ts-ignore
              this.babylonjs.debugLayer.hide()
            } else {
              // @ts-ignore
              this.babylonjs.debugLayer.show()
            } */
          }
        })
      }
    }
    ScenesController.register(new _class())
    return _class
  }
}
