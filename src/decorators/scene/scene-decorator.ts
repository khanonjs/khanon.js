// TODO lines from webpack
import '@babylonjs/inspector'
import '@babylonjs/core/Debug/debugLayer'

import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import { CameraConstructor } from '../../constructors/camera-constructor'
import { SceneActionConstructor } from '../../constructors/scene-action-constructor'
import { SceneStateConstructor } from '../../constructors/scene-state-constructor'
import {
  ActorsController,
  AssetsController,
  CamerasController,
  MeshesController,
  SceneActionsController,
  ScenesController,
  SceneStatesController,
  SpritesController
} from '../../controllers'
import { Core } from '../../core'
import KJS from '../../kjs'
import { AssetDefinition } from '../../models/asset-definition'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Logger } from '../../modules/logger'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeArrayDuplicitiesInObject,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { ActorInterface } from '../actor/actor-interface'
import { CameraInterface } from '../camera/camera-interface'
import { MeshInterface } from '../mesh'
import { ParticleSourceInterface } from '../particle-source/particle-source-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteInterface } from '../sprite'
import { SceneActionInterface } from './scene-action/scene-action-interface'
import { SceneActionOptions } from './scene-action/scene-action-options'
import { SceneCore } from './scene-core'
import { SceneInterface } from './scene-interface'
import { SceneMetadata } from './scene-metadata'
import { SceneProps } from './scene-props'
import { SceneRemove } from './scene-remove'
import { SceneSpawn } from './scene-spawn'
import { SceneStateInterface } from './scene-state/scene-state-interface'
import { SceneStateOptions } from './scene-state/scene-state-options'
import { SceneType } from './scene-type'

export function Scene(props: SceneProps): any {
  return function <T extends { new (...args: any[]): SceneType }>(constructor: T & SceneType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SceneCore, SceneInterface {
      constructor() {
        super()
        this._spawn = new SceneSpawn(this, _class.prototype)
        this._remove = new SceneRemove(this, _class.prototype)
        this.metadata.applyProps(this)
      }

      props = removeArrayDuplicitiesInObject(props)
      metadata: SceneMetadata = Reflect.getMetadata('metadata', this) ?? new SceneMetadata()
      actions: Map<SceneActionConstructor, SceneActionInterface> = new Map<SceneActionConstructor, SceneActionInterface>()
      protected _assets: AssetDefinition[]
      protected _loaded: boolean
      protected _started: boolean
      protected _state: SceneStateInterface
      protected _camera: CameraInterface
      protected _spawn: SceneSpawn
      protected _remove: SceneRemove

      // Spawned elements
      actors: ActorInterface[] = []
      particles: ParticleInterface[] = []
      particleSources: ParticleSourceInterface[] = []
      meshes: MeshInterface[] = []
      sprites: SpriteInterface[] = []

      setEngineParams(): void {}
      renderStart(id: string): void {}
      renderStop(id: string): void {}

      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null }
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>
      get assets(): AssetDefinition[] { return this._assets }
      get loaded(): boolean { return this._loaded }
      get started(): boolean { return this._started }
      get state(): SceneStateInterface { return this._state }
      get camera(): CameraInterface { return this._camera }
      get spawn(): SceneSpawn { return this._spawn }
      get remove(): SceneRemove { return this._remove }

      onStart?(): void
      onStop?(): void
      onLoaded?(): void
      onUnload?(): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(size: Rect): void

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }

      start(state: SceneStateConstructor): SceneStateInterface {
        Logger.debug('Scene start', _class.prototype)
        Core.startRenderScene(this)
        this._started = true
        this.startState(state)
        invokeCallback(this.onStart, this)
        attachLoopUpdate(this)
        attachCanvasResize(this)
        return this.state
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
        this.babylon.scene = new BABYLON.Scene(Core.engine, this.props.options)
        if (this.props.configuration) {
          for (const [key, value] of Object.entries(this.props.configuration)) {
            // TODO test this
            this.babylon.scene[key] = value
          }
        }

        // Babylon inspector (only DEV mode). Babylon inspector's imports are removed on webpack build.
        if (Core.isDevelopmentMode()) { // TODO uno por escena, permitir solo uno activo
          this.debugInspector()
        }

        const sceneProgress = new LoadingProgress()
        if (!this.assets) {
          this._assets = [
            ...AssetsController.findAssetsDefinitions(this.props),
            ...AssetsController.findAssetsDefinitions(this.metadata.getProps())
          ]
        }
        const assetsProgress = AssetsController.sceneLoad(this)

        assetsProgress.onComplete.add(() => {
          Logger.debug('Scene assets load completed', _class.prototype)
          ActorsController.load(this.props.actors, this)
          SpritesController.load(this.metadata.getProps().sprites, this)
          MeshesController.load(this.metadata.getProps().meshes, this)
          this.babylon.scene.executeWhenReady(() => {
            invokeCallback(this.onLoaded, this)
            sceneProgress.complete()
          })
        })
        assetsProgress.onError.add((error: string) => {
          Logger.debugError('Scene assets load error', error, _class.prototype)
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

      startState(state: SceneStateConstructor): SceneStateOptions {
        if (!this.props.states.find(_state => _state === state)) { Logger.debugError('Trying to set a state non available to the scene. Please check the scene props.', _class.prototype, state.prototype); return }
        const _state = SceneStatesController.get(state).spawn(this)
        if (this._state) {
          this._state.end()
        }
        this._state = _state
        this._state.start()
        return new SceneStateOptions(this._state)
      }

      playAction(actionConstructor: SceneActionConstructor): SceneActionOptions<any> {
        if (!this.props.actions?.find(_action => _action === actionConstructor) && !this.metadata.getProps().actions?.find(_action => _action === actionConstructor) && !this._state?.metadata.getProps().actions?.find(_action => _action === actionConstructor)) { Logger.debugError('Trying to play an action non available to the actor. Please check the actor props.', _class.prototype, actionConstructor.prototype); return }
        let action = this.actions.get(actionConstructor)
        if (!action) {
          action = SceneActionsController.get(actionConstructor).spawn(this)
          if (!this.props.actions?.find(_action => _action === actionConstructor)) {
            // Applies context to 'onLoopUpdate' as caller 'Actor' or 'ActorState' to preserve the 'this'
            // in case 'onLoopUpdate' is equivalent to a decorated method of some of those both interfaces.
            action.onLoopUpdate = action.onLoopUpdate.bind(
              this.metadata.getProps().actions?.find(_action => _action === actionConstructor)
                ? this
                : this._state?.metadata.getProps().actions?.find(_action => _action === actionConstructor)
                  ? this._state
                  : undefined
            )
          }
          this.actions.set(actionConstructor, action)
          action.props.overrides?.forEach(actionOverride => {
            this.actions.get(actionOverride)?.end()
          })
          action.start()
        }
        return new SceneActionOptions(action)
      }

      stopActionFromInstance(instance: SceneActionInterface) {
        for (const [key, value] of this.actions.entries()) {
          if (value === instance) {
            this.stopAction(key)
            return
          }
        }
      }

      stopAction(actionConstructor: SceneActionConstructor): void {
        const action = this.actions.get(actionConstructor)
        if (action) {
          action.end()
          if (!action.props.preserve) {
            this.actions.delete(actionConstructor)
          }
        }
      }

      stopActionGroup(group: number): void {
        const actionsStop: SceneActionConstructor[] = []
        this.actions.forEach((action, actionConstructor) => {
          if (action.props.group !== undefined && action.props.group === group) {
            actionsStop.push(actionConstructor)
          }
        })
        actionsStop.forEach(actionConstructor => this.stopAction(actionConstructor))
      }

      stopActionAll(): void {
        this.actions.forEach((action, actionConstructor) => {
          this.stopAction(actionConstructor)
        })
      }

      removeActor(actor: ActorInterface): void {
        actor.release()
        // 8a8f
        // this.actors.push(instance)
      }

      debugInspector(): void {
        // TODO ver qué hacer con esto
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
