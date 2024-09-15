// TODO lines from webpack
import '@babylonjs/inspector'
import '@babylonjs/core/Debug/debugLayer'

import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import {
  ActorActionsController,
  ActorsController,
  ActorStatesController,
  AssetsController,
  CamerasController,
  MeshesController,
  ParticlesController,
  SceneActionsController,
  ScenesController,
  SceneStatesController,
  SpritesController
} from '../../controllers'
import { Core } from '../../core'
import KJS from '../../kjs/kjs'
import { AssetDefinition } from '../../models/asset-definition'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Logger } from '../../modules/logger'
import { FlexId } from '../../types/flex-id'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  isPrototypeOf,
  removeArrayDuplicitiesInObject,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { ActorActionConstructor } from '../actor/actor-action/actor-action-constructor'
import { ActorActionInterface } from '../actor/actor-action/actor-action-interface'
import { ActorConstructor } from '../actor/actor-constructor'
import { ActorInterface } from '../actor/actor-interface'
import { ActorStateConstructor } from '../actor/actor-state/actor-state-constructor'
import { ActorStateInterface } from '../actor/actor-state/actor-state-interface'
import { CameraConstructor } from '../camera/camera-constructor'
import { CameraInterface } from '../camera/camera-interface'
import { MeshConstructor } from '../mesh/mesh-constructor'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleConstructor } from '../particle/particle-constructor'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteConstructor } from '../sprite/sprite-constructor'
import { SpriteInterface } from '../sprite/sprite-interface'
import { SceneActionConstructor } from './scene-action/scene-action-constructor'
import { SceneActionInterface } from './scene-action/scene-action-interface'
import { SceneAvailableElements } from './scene-available-elements'
import { SceneInterface } from './scene-interface'
import { SceneProps } from './scene-props'
import { SceneRemove } from './scene-remove'
import { SceneSpawn } from './scene-spawn'
import { SceneStateConstructor } from './scene-state/scene-state-constructor'
import { SceneStateInterface } from './scene-state/scene-state-interface'

export function Scene(props: SceneProps = {}): any {
  return function <T extends { new (...args: any[]): SceneInterface }>(constructor: T & SceneInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SceneInterface {
      constructor() {
        super()
        this._spawn = new SceneSpawn(this, _class.prototype)
        this._remove = new SceneRemove(this, _class.prototype)
        this.metadata.applyProps(this)
        this.storeAvailableElements()
      }

      props = removeArrayDuplicitiesInObject(props)
      metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      actions: Map<SceneActionConstructor, SceneActionInterface> = new Map<SceneActionConstructor, SceneActionInterface>()
      availableElements: SceneAvailableElements
      protected _assets: AssetDefinition[]
      protected _loaded: boolean
      protected _started: boolean
      protected _state: SceneStateInterface
      protected _camera: CameraInterface
      protected _spawn: SceneSpawn
      protected _remove: SceneRemove

      // Spawned elements
      actors: Set<ActorInterface> = new Set<ActorInterface>()
      meshes: Set<MeshInterface> = new Set<MeshInterface>()
      sprites: Set<SpriteInterface> = new Set<SpriteInterface>()
      particles: Set<ParticleInterface> = new Set<ParticleInterface>()

      setEngineParams(): void {} // TODO ?

      // User available
      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null as any }
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>
      get assets(): AssetDefinition[] { return this._assets }
      get loaded(): boolean { return this._loaded }
      get started(): boolean { return this._started }
      get state(): SceneStateInterface { return this._state }
      get camera(): CameraInterface { return this._camera }
      get spawn(): SceneSpawn { return this._spawn }
      get remove(): SceneRemove { return this._remove }

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }

      start(state: SceneStateConstructor, stateSetup: any): SceneStateInterface {
        Logger.debug('Scene start', _class.prototype)
        this._started = true
        this.switchState(state, stateSetup)
        invokeCallback(this.onStart, this)
        if (!this.loaded) {
          Logger.warn('Starting a scene that hasn\'t been loaded. Are you sure you want to do this?', _class.prototype)
        }
        if (!this.camera) { Logger.debugError('Please set a camera before starting the scene. Do it in the (Scene / SceneState) \'onSart\' method:', _class.prototype); return null as any }
        Core.startRenderScene(this)
        attachLoopUpdate(this)
        attachCanvasResize(this)
        return this.state
      }

      stop(): void {
        Logger.debug('Scene stop', _class.prototype)
        this._started = false
        this.state.end()
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
            this.babylon.scene[key] = value
          }
        }

        // Babylon inspector (only DEV mode). Babylon inspector's imports are removed on webpack build.
        if (Core.isDevelopmentMode()) { // TODO one per scene, allow only one at the same time
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
          SceneStatesController.load(this.props.states, this)
          SceneActionsController.load(this.props.actions, this)
          SceneActionsController.load(this.metadata.getProps().actions, this)
          ActorsController.load(this.props.actors, this)
          SpritesController.load(this.props.sprites, this)
          SpritesController.load(this.metadata.getProps().sprites, this)
          MeshesController.load(this.props.meshes, this)
          MeshesController.load(this.metadata.getProps().meshes, this)
          ParticlesController.load(this.props.particles, this)
          ParticlesController.load(this.metadata.getProps().particles, this)
          this.babylon.scene?.executeWhenReady(() => {
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
        Logger.debug('Scene unload', _class.prototype, this)
        SceneStatesController.unload(this.props.states, this)
        SceneActionsController.unload(this.props.actions, this)
        SceneActionsController.unload(this.metadata.getProps().actions, this)
        ActorsController.unload(this.props.actors, this)
        SpritesController.unload(this.props.sprites, this)
        SpritesController.unload(this.metadata.getProps().sprites, this)
        MeshesController.unload(this.props.meshes, this)
        MeshesController.unload(this.metadata.getProps().meshes, this)
        ParticlesController.unload(this.props.particles, this)
        ParticlesController.unload(this.metadata.getProps().particles, this)
      }

      setCamera(constructor: CameraConstructor): void {
        const camera = CamerasController.get(constructor).spawn(this)
        if (this._camera) {
          this._camera.stop()
        }
        this._camera = camera
        this._camera.babylon.camera = (this._camera.initialize as any)(this.babylon.scene)
        this._camera.babylon.camera.attachControl(Core.canvas, true)
        this._camera.start()
      }

      switchState(state: SceneStateConstructor, setup: any): SceneStateInterface {
        if (!this.availableElements.hasSceneState(state)) { Logger.debugError('Trying to set a state non available to the scene. Please check the scene props.', _class.prototype, state.prototype); return null as any }
        const _state = SceneStatesController.get(state).spawn(this)
        if (this._state) {
          this._state.end()
        }
        this._state = _state
        this._state.start(setup)
        return this._state
      }

      playAction(actionConstructor: SceneActionConstructor, setup: any): SceneActionInterface {
        if (!this.availableElements.hasSceneAction(actionConstructor)) { Logger.debugError('Trying to play an action non available to the actor. Please check the actor props.', _class.prototype, actionConstructor.prototype); return null as any }
        let action = this.actions.get(actionConstructor)
        if (!action) {
          action = SceneActionsController.get(actionConstructor).spawn(this)
          if (!this.props.actions?.find(_action => _action === actionConstructor)) {
            // Applies context 'Scene' or 'SceneState' to 'onLoopUpdate' method to preserve the 'this'
            // in case 'onLoopUpdate' is equivalent to a decorated method of some of those both interfaces.
            action.onLoopUpdate = action.onLoopUpdate?.bind(
              this.metadata.getProps().actions?.find(_action => _action === actionConstructor)
                ? this
                : this._state?.metadata?.getProps().actions?.find(_action => _action === actionConstructor)
                  ? this._state
                  : undefined
            )
          }
          this.actions.set(actionConstructor, action)
          action.props.overrides?.forEach(actionOverride => this.stopAction(actionOverride))
          action.start(setup)
        }
        return action
      }

      getAction(actionConstructor: SceneActionConstructor): SceneActionInterface | undefined {
        return this.actions.get(actionConstructor)
      }

      stopActionFromInstance(instance: SceneActionInterface, forceRemove?: boolean) {
        for (const [key, value] of this.actions.entries()) {
          if (value === instance) {
            this.stopAction(key, forceRemove)
            return
          }
        }
      }

      stopAction(actionConstructor: SceneActionConstructor, forceRemove?: boolean): void {
        const action = this.actions.get(actionConstructor)
        if (action) {
          removeLoopUpdate(action)
          removeCanvasResize(action)
          invokeCallback(action.onStop, action)
          if (!action.props.preserve || forceRemove) {
            invokeCallback(action.onRemove, action)
            this.actions.delete(actionConstructor)
          }
        }
      }

      stopActionGroup(group: number, forceRemove?: boolean): void {
        this.actions.forEach((action, actionConstructor) => {
          if (action.props.group !== undefined && action.props.group === group) {
            this.stopAction(actionConstructor, forceRemove)
          }
        })
      }

      stopActionAll(forceRemove?: boolean): void {
        this.actions.forEach((action, actionConstructor) => {
          this.stopAction(actionConstructor, forceRemove)
        })
      }

      removeAction(actionConstructor: ActorActionConstructor): void {
        this.stopAction(actionConstructor, true)
      }

      removeActionGroup(group: number): void {
        this.stopActionGroup(group, true)
      }

      removeActionAll(): void {
        this.stopActionAll(true)
      }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this.metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }

      /**
       * Returns all available constructors in a props tree
       * TODO: Why _interface can't have type (ActorInterface | SpriteInterface | MeshInterface | ActorActionInterface | SceneActionInterface) ?
       */
      private storeAvailableElements() {
        this.availableElements = new SceneAvailableElements()
        this.getAvailableElements(this.props)
        this.getAvailableElements(this.metadata.getProps())
      }

      private getAvailableElements(props: object | undefined): void {
        if (props && typeof props === 'object') {
          for (const property of Object.values(props)) {
            if (Array.isArray(property)) {
              property.forEach(value => {
                if (isPrototypeOf(ActorInterface, value)) { // TODO insert all these constructors in a list and avoid the 'callback hell'
                  this.availableElements.actors.add(value)
                  const actor = ActorsController.get(value as ActorConstructor)
                  this.getAvailableElements(actor.props)
                  this.getAvailableElements(actor.Instance.metadata?.getProps())
                } else if (isPrototypeOf(SpriteInterface, value)) {
                  this.availableElements.sprites.add(value)
                  const sprite = SpritesController.get(value as SpriteConstructor)
                  this.getAvailableElements(sprite.props)
                } else if (isPrototypeOf(MeshInterface, value)) {
                  this.availableElements.meshes.add(value)
                  const mesh = MeshesController.get(value as MeshConstructor)
                  this.getAvailableElements(mesh.props)
                } else if (isPrototypeOf(ActorActionInterface, value)) {
                  this.availableElements.actorActions.add(value)
                  const action = ActorActionsController.get(value as ActorActionConstructor)
                  this.getAvailableElements(action.props)
                  this.getAvailableElements(action.Instance.metadata?.getProps())
                } else if (isPrototypeOf(ActorStateInterface, value)) {
                  this.availableElements.actorStates.add(value)
                  const state = ActorStatesController.get(value as ActorStateConstructor)
                  this.getAvailableElements(state.props)
                  this.getAvailableElements(state.Instance.metadata?.getProps())
                } else if (isPrototypeOf(ParticleInterface, value)) {
                  this.availableElements.particles.add(value)
                  const particle = ParticlesController.get(value as ParticleConstructor)
                  this.getAvailableElements(particle.props)
                  this.getAvailableElements(particle.Instance.metadata?.getProps())
                } else if (isPrototypeOf(SceneActionInterface, value)) {
                  this.availableElements.sceneActions.add(value)
                  const action = SceneActionsController.get(value as SceneActionConstructor)
                  this.getAvailableElements(action.props)
                  this.getAvailableElements(action.Instance.metadata?.getProps())
                } else if (isPrototypeOf(SceneStateInterface, value)) {
                  this.availableElements.sceneStates.add(value)
                  const state = SceneStatesController.get(value as SceneStateConstructor)
                  this.getAvailableElements(state.props)
                  this.getAvailableElements(state.Instance.metadata?.getProps())
                }
              })
            }
          }
        }
      }

      debugInspector(): void {
        // TODO handle this for each scene (only one can be active at once)
        window.addEventListener('keyup', (ev) => {
          if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'I') {
            if (this.babylon.scene.debugLayer.isVisible()) {
              this.babylon.scene.debugLayer.hide()
            } else {
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
