import * as BABYLON from '@babylonjs/core'

import {
  AssetDefinition,
  LoadingProgress
} from '../../base'
import { Core } from '../../base/core/core'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import {
  ActorActionsController,
  ActorsController,
  ActorStatesController,
  AssetsController,
  CamerasController,
  GUIController,
  MeshesController,
  ParticlesController,
  SceneActionsController,
  ScenesController,
  SceneStatesController,
  SpritesController
} from '../../controllers'
import KJS from '../../kjs/kjs'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { Logger } from '../../modules/logger'
import { FlexId } from '../../types/flex-id'
import {
  applyDefaults,
  attachCanvasResize,
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
import { Camera } from '../camera/camera-decorator'
import { CameraInterface } from '../camera/camera-interface'
import { GUIConstructor } from '../gui/gui-constructor'
import { GUIInterface } from '../gui/gui-interface'
import { MeshConstructor } from '../mesh/mesh-constructor'
import { Mesh } from '../mesh/mesh-decorator'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleConstructor } from '../particle/particle-constructor'
import { ParticleInterface } from '../particle/particle-interface'
import { SpriteAnimation } from '../sprite/sprite-animation'
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
import { scenePropsDefault } from './scene.props.default'

export function Scene(props: SceneProps = {}): any {
  return function <T extends { new (...args: any[]): SceneInterface }>(constructor: T & SceneInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor implements SceneInterface {
      constructor() {
        super()
        this._spawn = new SceneSpawn(this)
        this._remove = new SceneRemove(this)
        this._metadata.applyProps(this)
        this.storeAvailableElements()
      }

      getClassName(): string { return constructor.name }

      setTimeout(func: () => void, ms: number): Timeout { return Core.setTimeout(func, ms, this) }
      setInterval(func: () => void, ms: number): Timeout { return Core.setInterval(func, ms, this) }
      clearTimeout(timeout: Timeout): void { Core.clearTimeout(timeout) }
      clearInterval(interval: Timeout): void { Core.clearInterval(interval) }
      clearAllTimeouts(): void { Core.clearAllTimeoutsByContext(this) }

      _props = removeArrayDuplicitiesInObject(applyDefaults(props, scenePropsDefault))
      _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      _actions: Map<SceneActionConstructor, SceneActionInterface> = new Map<SceneActionConstructor, SceneActionInterface>()
      _availableElements: SceneAvailableElements
      _animationHandler: Map<SpriteInterface, () => void> = new Map<SpriteInterface, () => void>()
      _assets: AssetDefinition[]
      _loaded: boolean
      _loadingProgress: LoadingProgress | undefined
      _started: boolean
      _state: SceneStateInterface | null = null
      _camera: CameraInterface | undefined
      _cameraConstructor: CameraConstructor
      _cameraSetup: any
      _spawn: SceneSpawn
      _remove: SceneRemove
      _loopUpdate = true
      _debugInspector: (event: KeyboardEvent) => void

      // Spawned elements
      _actors: Set<ActorInterface> = new Set<ActorInterface>()
      _meshes: Set<MeshInterface> = new Set<MeshInterface>()
      _sprites: Set<SpriteInterface> = new Set<SpriteInterface>()
      _particles: Set<ParticleInterface> = new Set<ParticleInterface>()
      _guis: Map<GUIConstructor, GUIInterface> = new Map<GUIConstructor, GUIInterface>()

      _setEngineParams(): void {} // TODO ?

      // User available
      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null as any }
      _loopUpdate$: BABYLON.Observer<number>
      _canvasResize$: BABYLON.Observer<Rect>
      get loaded(): boolean { return this._loaded }
      get started(): boolean { return this._started }
      get state(): SceneStateInterface | null { return this._state }
      get spawn(): SceneSpawn { return this._spawn }
      get remove(): SceneRemove { return this._remove }

      set loopUpdate(value: boolean) {
        this._loopUpdate = value
        switchLoopUpdate(this._loopUpdate, this)
      }

      get loopUpdate(): boolean { return this._loopUpdate }

      start(state?: SceneStateConstructor, stateSetup?: any): SceneStateInterface | null {
        Logger.debug('Scene start', this.getClassName())
        if (this._started) {
          this.stop()
        }
        if (this._cameraConstructor) {
          this.switchCamera(this._cameraConstructor, this._cameraSetup)
        }
        this._started = true
        if (state) {
          this.switchState(state, stateSetup)
        }
        invokeCallback(this.onStart, this)
        if (!this.loaded) {
          Logger.warn('Starting a scene that hasn\'t been loaded. Are you sure you want to do this?', this.getClassName())
        }
        if (!this._camera) {
          Logger.warn('No camera defined: using a generic camera. Use \'switchCamera\' in the Scene\'s or SceneState\'s \'onStart\' callback to set a camera before starting the scene.', this.getClassName())
          @Camera()
          // @ts-ignore
          class GenericCamera extends CameraInterface {
            onInitialize() {
              const camera = new BABYLON.UniversalCamera('Generic camera', new BABYLON.Vector3(0, 0, 0), this.babylon.scene)
              camera.target = new BABYLON.Vector3(1, 0, 0)
              camera.inputs.clear()
              camera.minZ = 0.01
              return camera
            }
          }
          this.switchCamera(GenericCamera, {})
        }
        if (Core.isDevelopmentMode() && this._props.useDebugInspector) {
          this._useDebugInspector()
        }
        Core.startRenderScene(this)
        this._startRenderObservable()
        switchLoopUpdate(this._loopUpdate, this)
        attachCanvasResize(this)
        return this.state
      }

      stop(): void {
        Logger.debug('Scene stop', this.getClassName())
        if (Core.isDevelopmentMode()) {
          this._denyDebugInspector()
        }
        invokeCallback(this.onStop, this)
        this.clearAllTimeouts()
        this._releaseGUIs()
        this.releaseCamera()
        this.state?._end()
        this.remove.all()
        this._started = false
        Core.stopRenderScene(this)
        this._stopRenderObservable()
        removeLoopUpdate(this)
        removeCanvasResize(this)
      }

      load(): LoadingProgress {
        Logger.debug('Scene load', this.getClassName())

        if (this._loaded) {
          return new LoadingProgress().complete()
        } else if (this._loadingProgress) {
          return this._loadingProgress
        } else {
          // Create babylon scene and apply configuration
          this.babylon.scene = new BABYLON.Scene(Core.engine, this._props.options)

          this._loadingProgress = new LoadingProgress()
          if (!this._assets) {
            this._assets = [
              ...AssetsController.findAssetsDefinitions(this._props),
              ...AssetsController.findAssetsDefinitions(this._metadata.getProps())
            ]
          }
          const assetsProgress = AssetsController.sceneLoad(this)
          assetsProgress.onComplete.add(() => {
            Logger.debug('Scene assets load completed', this.getClassName())
            const elementsLoading = new LoadingProgress().fromNodes([
              SceneStatesController.load(this._props.states, this),
              SceneActionsController.load(this._props.actions, this),
              SceneActionsController.load(this._metadata.getProps().actions, this),
              ActorsController.load(this._props.actors, this),
              SpritesController.load(this._props.sprites, this),
              SpritesController.load(this._metadata.getProps().sprites, this),
              MeshesController.load(this._props.meshes, this),
              MeshesController.load(this._metadata.getProps().meshes, this),
              ParticlesController.load(this._props.particles, this),
              ParticlesController.load(this._metadata.getProps().particles, this),
              GUIController.load(this._props.guis, this)
            ])
            elementsLoading.onComplete.add(() => {
              Logger.debug('Scene elements load completed', this.getClassName())
              const startScene = () => {
                // Load configuration after Elements loading, to avoid AppendAsync method to override these configurations.
                if (this._props.configuration) {
                  for (const [key, value] of Object.entries(this._props.configuration)) {
                    this.babylon.scene[key] = value
                  }
                }
                this.babylon.scene.executeWhenReady(() => {
                  this._loaded = true
                  invokeCallback(this.onLoaded, this)
                  this._availableElements.actors.forEach(actorConsctructor => {
                    const actorCore = ActorsController.get(actorConsctructor)
                    if (actorCore.props.spawnByReferenceId) {
                      const meshes = [...this.babylon.scene.meshes].reverse()
                      meshes.forEach(mesh => {
                        // @ts-ignore
                        if (mesh.id.indexOf(actorCore.props.spawnByReferenceId) === 0) {
                          const actor = this.spawn.actor(actorConsctructor)
                          if (actor.body) {
                            // actor.body.babylon.mesh.position = mesh.getBoundingInfo().boundingBox.centerWorld
                            actor.body.babylon.mesh.position = mesh.position
                            mesh.dispose()
                          } else {
                            @Mesh()
                            // @ts-ignore
                            class NewMesh extends MeshInterface {
                              onSpawn() {
                                this.setMesh(mesh as any)
                              }
                            }
                            this._availableElements.meshes.add(NewMesh)
                            actor.setBody(NewMesh)
                          }
                        }
                      })
                    }
                  })
                  this._loadingProgress?.complete()
                  this._loadingProgress = undefined
                })
              }
              if (this._props.url) {
                BABYLON.AppendSceneAsync(this._props.url, this.babylon.scene)
                  .then(() => {
                    Logger.debug(`Scene load  AppendAsync from '${this._props.url}' completed.`, this.getClassName())
                    startScene()
                  })
                  .catch((error: string) => {
                    Logger.debugError(`Scene load AppendAsync from '${this._props.url}' error`, error, this.getClassName())
                  })
              } else {
                startScene()
              }
            })
          })
          assetsProgress.onError.add((error: string) => {
            Logger.debugError('Scene assets load error', error, this.getClassName())
            KJS.throw(error)
          })
          assetsProgress.onProgress.add((progress: number) => {
            this._loadingProgress?.setProgress(progress)
          })
          return this._loadingProgress ?? new LoadingProgress().complete()
        }
      }

      unload(): void {
        Logger.debug('Scene unload', this.getClassName(), this.getClassName())
        this._loaded = false
        SceneStatesController.unload(this._props.states, this)
        SceneActionsController.unload(this._props.actions, this)
        SceneActionsController.unload(this._metadata.getProps().actions, this)
        ActorsController.unload(this._props.actors, this)
        SpritesController.unload(this._props.sprites, this)
        SpritesController.unload(this._metadata.getProps().sprites, this)
        MeshesController.unload(this._props.meshes, this)
        MeshesController.unload(this._metadata.getProps().meshes, this)
        ParticlesController.unload(this._props.particles, this)
        ParticlesController.unload(this._metadata.getProps().particles, this)
        GUIController.unload(this._props.guis, this)
      }

      showGUI<G extends GUIInterface>(gui: GUIConstructor, setup: any): G {
        Logger.debug('Show GUI', this.getClassName(), GUIController.get(gui).getClassName())
        let guiInstance = this._guis.get(gui)
        if (guiInstance) {
          guiInstance._release()
        }
        guiInstance = GUIController.get(gui).spawn(this)
        guiInstance._initialize(setup)
        this._guis.set(gui, guiInstance)
        return guiInstance as any
      }

      hideGUI(gui: GUIConstructor): void {
        Logger.debug('Hide GUI', this.getClassName(), GUIController.get(gui).getClassName())
        const guiInstance = this._guis.get(gui)
        if (guiInstance) {
          guiInstance._release()
          this._guis.delete(gui)
        } else {
          Logger.warn('Trying to hide a GUI that\'s not being displayed.', this.getClassName(), GUIController.get(gui).getClassName())
        }
      }

      getGUI<G extends GUIInterface>(gui: GUIConstructor): G | undefined {
        return this._guis.get(gui) as any
      }

      _startRenderObservable(): void {
        this.babylon.scene.onBeforeRenderObservable.add(() => {
          this._animationHandler.forEach(handler => {
            handler()
          })
        })
      }

      _stopRenderObservable(): void {
        this.babylon.scene.onBeforeRenderObservable.clear()
      }

      _releaseGUIs(): void {
        this._guis.forEach(gui => gui._release())
        this._guis.clear()
      }

      switchCamera(constructor: CameraConstructor, setup: any): void {
        this.releaseCamera()
        this._cameraConstructor = constructor
        this._cameraSetup = setup
        this._camera = CamerasController.get(constructor).spawn(this)
        this._camera.setup = setup
        this._camera.babylon.camera = (this._camera.onInitialize as any)(this.babylon.scene)
        this._camera.babylon.camera.attachControl(Core.canvas, true)
        this._camera._start()
      }

      releaseCamera(): void {
        if (this._camera) {
          this._camera._release()
          this._camera.babylon.camera.detachControl()
          this._camera = undefined
          this.babylon.scene.activeCamera = null
        }
      }

      getCamera<C extends CameraInterface = CameraInterface>(): C {
        return this._camera as C
      }

      switchState(state: SceneStateConstructor, setup: any): SceneStateInterface {
        if (!this._availableElements.hasSceneState(state)) { Logger.debugError('Denied to set a state not available to the scene. Did you mean to add it to the scene props?', this.getClassName(), state.prototype); return null as any }
        const _state = SceneStatesController.get(state).spawn(this)
        if (this._state) {
          this._state._end()
        }
        this._state = _state
        this._state._start(setup)
        return this._state
      }

      _setAnimationHandler(sprite: SpriteInterface, animation: SpriteAnimation): void {
        const startMs = Core.getLoopUpdateLastMs()
        const numSprites = animation.frameEnd - animation.frameStart
        const totalTimeMs = numSprites * animation.delay
        const handleLoop = () => {
          sprite._setShaderMaterialTextureFrame(animation.frameStart + (Math.trunc(((Core.getLoopUpdateLastMs() - startMs) % totalTimeMs) / animation.delay)))
        }
        const handleNoLoop = () => {
          const loopUpdateLastMs = Core.getLoopUpdateLastMs()
          if (loopUpdateLastMs - startMs >= totalTimeMs) {
            sprite._setShaderMaterialTextureFrame(animation.frameEnd)
            this._animationHandler.delete(sprite)
          } else {
            sprite._setShaderMaterialTextureFrame(animation.frameStart + (Math.trunc(((Core.getLoopUpdateLastMs() - startMs) % totalTimeMs) / animation.delay)))
          }
        }
        this._animationHandler.set(sprite, animation.loop ? handleLoop : handleNoLoop)
      }

      _stopAnimationHandler(sprite: SpriteInterface): void {
        this._animationHandler.delete(sprite)
      }

      getActionOwner(actionConstructor: SceneActionConstructor): SceneInterface | SceneStateInterface | undefined {
        return this._metadata.getProps().actions?.find(_action => _action === actionConstructor)
          ? this
          : this._state?._metadata?.getProps().actions?.find(_action => _action === actionConstructor)
            ? this._state
            : undefined
      }

      playAction(actionConstructor: SceneActionConstructor, setup: any): SceneActionInterface {
        if (!this._availableElements.hasSceneAction(actionConstructor)) { Logger.debugError('Trying to play an action non available to the actor. Please check the actor props.', this.getClassName(), actionConstructor.prototype); return null as any }
        let action = this._actions.get(actionConstructor)
        if (!action) {
          action = SceneActionsController.get(actionConstructor).spawn(this)
          let actionOwner: any
          if (!this._props.actions?.find(_action => _action === actionConstructor)) {
            // Applies context 'Scene' or 'SceneState' to 'onLoopUpdate' method to preserve the 'this'
            // in case 'onLoopUpdate' is equivalent to a decorated method of some of those both interfaces.
            actionOwner = this.getActionOwner(actionConstructor)
            action.onLoopUpdate = action.onLoopUpdate?.bind(actionOwner)
          }
          this._actions.set(actionConstructor, action)
          action._props.overrides?.forEach(actionOverride => {
            if (typeof actionOverride === 'string') {
              const overrideConstructor = this.getActionOwner(actionConstructor)?._metadata.actions.find(_action => _action.methodName === actionOverride)?.classDefinition
              if (!overrideConstructor) { Logger.debugError(`Action class method not found to override: '${actionOverride}'`) }
              if (actionConstructor) {
                this.stopAction(overrideConstructor)
              }
            } else {
              this.stopAction(actionOverride)
            }
          })
          action._start(setup)
        }
        return action
      }

      _playActionFromInstance(instance: SceneActionInterface): void {
        for (const [key, value] of this._actions.entries()) {
          if (value === instance) {
            this.playAction(key, {})
            return
          }
        }
      }

      _stopActionFromInstance(instance: SceneActionInterface, forceRemove?: boolean) {
        for (const [key, value] of this._actions.entries()) {
          if (value === instance) {
            this.stopAction(key, forceRemove)
            return
          }
        }
      }

      stopAction(actionConstructor: SceneActionConstructor, forceRemove?: boolean): void {
        const action = this._actions.get(actionConstructor)
        if (action) {
          removeLoopUpdate(action)
          removeCanvasResize(action)
          invokeCallback(action.onStop, action)
          if (!action._props.preserve || forceRemove) {
            invokeCallback(action.onRemove, action)
            action.clearAllTimeouts()
            this._actions.delete(actionConstructor)
          }
        }
      }

      playActionGroup(group: FlexId): void {
        this._actions.forEach((action, actionConstructor) => {
          if (action._props.group !== undefined && action._props.group === group) {
            this.playAction(actionConstructor, {})
          }
        })
      }

      stopActionGroup(group: FlexId, forceRemove?: boolean): void {
        this._actions.forEach((action, actionConstructor) => {
          if (action._props.group !== undefined && action._props.group === group) {
            this.stopAction(actionConstructor, forceRemove)
          }
        })
      }

      stopActionAll(forceRemove?: boolean): void {
        this._actions.forEach((action, actionConstructor) => {
          this.stopAction(actionConstructor, forceRemove)
        })
      }

      removeAction(actionConstructor: ActorActionConstructor): void {
        this.stopAction(actionConstructor, true)
      }

      removeActionGroup(group: FlexId): void {
        this.stopActionGroup(group, true)
      }

      removeActionAll(): void {
        this.stopActionAll(true)
      }

      getAction(actionConstructor: SceneActionConstructor): SceneActionInterface | undefined {
        return this._actions.get(actionConstructor)
      }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this._metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }

      /**
       * Returns all available constructors in a props tree
       * TODO: Why _interface can't have type (ActorInterface | SpriteInterface | MeshInterface | ActorActionInterface | SceneActionInterface) ?
       */
      private storeAvailableElements() {
        this._availableElements = new SceneAvailableElements()
        this.getAvailableElements(this._props)
        this.getAvailableElements(this._metadata.getProps())
      }

      private getAvailableElements(props: object | undefined): void {
        if (props && typeof props === 'object') {
          for (const property of Object.values(props)) {
            if (Array.isArray(property)) {
              property.forEach(value => {
                if (isPrototypeOf(ActorInterface, value)) { // TODO insert all these constructors in a list and make generic method
                  this._availableElements.actors.add(value)
                  const actor = ActorsController.get(value as ActorConstructor)
                  this.getAvailableElements(actor.props)
                  this.getAvailableElements(actor.Instance._metadata?.getProps())
                } else if (isPrototypeOf(SpriteInterface, value)) {
                  this._availableElements.sprites.add(value)
                  const sprite = SpritesController.get(value as SpriteConstructor)
                  this.getAvailableElements(sprite.props)
                } else if (isPrototypeOf(MeshInterface, value)) {
                  this._availableElements.meshes.add(value)
                  const mesh = MeshesController.get(value as MeshConstructor)
                  this.getAvailableElements(mesh.props)
                } else if (isPrototypeOf(ActorActionInterface, value)) {
                  this._availableElements.actorActions.add(value)
                  const action = ActorActionsController.get(value as ActorActionConstructor)
                  this.getAvailableElements(action.props)
                  this.getAvailableElements(action.Instance._metadata?.getProps())
                } else if (isPrototypeOf(ActorStateInterface, value)) {
                  this._availableElements.actorStates.add(value)
                  const state = ActorStatesController.get(value as ActorStateConstructor)
                  this.getAvailableElements(state.props)
                  this.getAvailableElements(state.Instance._metadata?.getProps())
                } else if (isPrototypeOf(ParticleInterface, value)) {
                  this._availableElements.particles.add(value)
                  const particle = ParticlesController.get(value as ParticleConstructor)
                  this.getAvailableElements(particle.props)
                  this.getAvailableElements(particle.Instance._metadata?.getProps())
                } else if (isPrototypeOf(SceneActionInterface, value)) {
                  this._availableElements.sceneActions.add(value)
                  const action = SceneActionsController.get(value as SceneActionConstructor)
                  this.getAvailableElements(action.props)
                  this.getAvailableElements(action.Instance._metadata?.getProps())
                } else if (isPrototypeOf(SceneStateInterface, value)) {
                  this._availableElements.sceneStates.add(value)
                  const state = SceneStatesController.get(value as SceneStateConstructor)
                  this.getAvailableElements(state.props)
                  this.getAvailableElements(state.Instance._metadata?.getProps())
                }
              })
            }
          }
        }
      }

      _useDebugInspector(): void {
        if (!this._debugInspector) {
          this._debugInspector = (event: KeyboardEvent) => {
            if (event.shiftKey && event.ctrlKey && event.altKey && event.key === 'I') {
              if (this.babylon.scene.debugLayer.isVisible()) {
                this.babylon.scene.debugLayer.hide()
              } else {
                this.babylon.scene.debugLayer.show()
              }
            }
          }
          window.addEventListener('keyup', this._debugInspector)
        }
      }

      _denyDebugInspector(): void {
        if (this._debugInspector) {
          window.removeEventListener('keyup', this._debugInspector)
          this._debugInspector = undefined as any
          if (this.babylon.scene.debugLayer.isVisible()) {
            this.babylon.scene.debugLayer.hide()
          }
        }
      }
    }
    ScenesController.register(new _class())
    return _class
  }
}
