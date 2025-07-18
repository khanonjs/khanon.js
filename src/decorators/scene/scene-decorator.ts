import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera'
import { IPointerEvent } from '@babylonjs/core/Events/deviceInputEvents'
import { AppendSceneAsync } from '@babylonjs/core/Loading/sceneLoader'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import {
  Observable,
  Observer
} from '@babylonjs/core/Misc/observable'
import { Scene as BabylonScene } from '@babylonjs/core/scene'

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
  SoundsController,
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
        this._metadata.applyProps(this, this)
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
      _$keyDown: Observable<KeyboardEvent> = new Observable<KeyboardEvent>()
      _$keyUp: Observable<KeyboardEvent> = new Observable<KeyboardEvent>()
      _$keyPress: Observable<KeyboardEvent> = new Observable<KeyboardEvent>()
      _$pointerDown: Observable<IPointerEvent> = new Observable<IPointerEvent>()
      _$pointerUp: Observable<IPointerEvent> = new Observable<IPointerEvent>()
      _$pointerPress: Observable<IPointerEvent> = new Observable<IPointerEvent>()
      _$pointerMove: Observable<IPointerEvent> = new Observable<IPointerEvent>()
      _$pointerDrag: Observable<IPointerEvent> = new Observable<IPointerEvent>()
      _pointerPressInterval: Timeout
      _pointerPress = false
      _pointerPressEvent: IPointerEvent
      _debugInspector: (event: KeyboardEvent) => void

      // Spawned elements
      _actors: Set<ActorInterface> = new Set<ActorInterface>()
      _actorsByType: Map<ActorConstructor, ActorInterface[]> = new Map<ActorConstructor, ActorInterface[]>()
      _meshes: Set<MeshInterface> = new Set<MeshInterface>()
      _sprites: Set<SpriteInterface> = new Set<SpriteInterface>()
      _particles: Set<ParticleInterface> = new Set<ParticleInterface>()
      _guis: Map<GUIConstructor, GUIInterface> = new Map<GUIConstructor, GUIInterface>()

      isState(state: SceneStateConstructor): boolean {
        if (this.state) {
          return this.state instanceof state
        } else {
          return false
        }
      }

      // User available
      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null as any }
      _loopUpdate$: Observer<number>
      _canvasResize$: Observer<Rect>
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
        invokeCallback(this.onStart, this)
        if (state) {
          this.switchState(state, stateSetup)
        }
        if (!this.loaded) {
          Logger.warn('Starting a scene that hasn\'t been loaded. Are you sure you want to do this?', this.getClassName())
        }
        if (!this._camera) {
          Logger.warn('No camera defined: using a generic camera. Use \'switchCamera\' in the Scene\'s or SceneState\'s \'onStart\' callback to set a camera before starting the scene.', this.getClassName())
          @Camera()
          // @ts-ignore
          class GenericCamera extends CameraInterface {
            onInitialize() {
              const camera = new UniversalCamera('Generic camera', new Vector3(0, 0, 0), this.babylon.scene)
              camera.target = new Vector3(1, 0, 0)
              camera.inputs.clear()
              camera.minZ = 0.01
              return camera
            }
          }
          this.switchCamera(GenericCamera, {})
        }
        Core.startRenderScene(this)
        this._startRenderObservable()
        this._started = true
        this._actors.forEach(actor => {
          actor._applyStarted()
        })
        if (Core.isDevelopmentMode() && this._props.useDebugInspector) {
          this._useDebugInspector()
        }
        this._metadata.startInputEvents()
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
        this.stopActionAll()
        this._releaseGUIs()
        this.releaseCamera()
        this.state?._end()
        this.remove.all()
        this._started = false
        Core.stopRenderScene(this)
        this._stopRenderObservable()
        this._metadata.stopInputEvents()
        removeLoopUpdate(this)
        removeCanvasResize(this)
      }

      _load(): LoadingProgress {
        Logger.debug('Scene load', this.getClassName())

        if (this._loaded) {
          return new LoadingProgress().complete()
        } else if (this._loadingProgress) {
          return this._loadingProgress
        } else {
          // Create babylon scene and apply configuration
          this.babylon.scene = new BabylonScene(Core.engine, this._props.options)

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
              ActorsController.load(this._props.actors, this),
              SpritesController.load(this._props.sprites, this),
              SpritesController.load(this._metadata.getProps().sprites, this),
              MeshesController.load(this._props.meshes, this),
              MeshesController.load(this._metadata.getProps().meshes, this),
              ParticlesController.load(this._props.particles, this),
              ParticlesController.load(this._metadata.getProps().particles, this),
              SoundsController.load(this._metadata.getProps().sounds, null),
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
                AppendSceneAsync(this._props.url, this.babylon.scene)
                  .then(() => {
                    Logger.debug(`Scene load AppendAsync from '${this._props.url}' completed.`, this.getClassName())
                    startScene()
                  })
                  .catch((error: string) => {
                    Logger.error(`Scene load AppendAsync from '${this._props.url}' error`, error, this.getClassName())
                  })
              } else {
                startScene()
              }
            })
          })
          assetsProgress.onError.add((error: string) => {
            Logger.error('Scene assets load error', error, this.getClassName())
            KJS.throw(error)
          })
          assetsProgress.onProgress.add((progress: number) => {
            this._loadingProgress?.setProgress(progress)
          })
          return this._loadingProgress ?? new LoadingProgress().complete()
        }
      }

      _unload(): void {
        Logger.debug('Scene unload', this.getClassName(), this.getClassName())
        this._loaded = false
        SceneStatesController.unload(this._props.states, this)
        SceneActionsController.unload(this._props.actions, this)
        ActorsController.unload(this._props.actors, this)
        SpritesController.unload(this._props.sprites, this)
        SpritesController.unload(this._metadata.getProps().sprites, this)
        MeshesController.unload(this._props.meshes, this)
        MeshesController.unload(this._metadata.getProps().meshes, this)
        ParticlesController.unload(this._props.particles, this)
        ParticlesController.unload(this._metadata.getProps().particles, this)
        SoundsController.unload(this._metadata.getProps().sounds, null)
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

      _eventKeyPress = (event: KeyboardEvent) => {
        this._$keyPress.notifyObservers(event)
      }

      _eventKeyUp = (event: KeyboardEvent) => {
        this._$keyUp.notifyObservers(event)
      }

      _eventKeyDown = (event: KeyboardEvent) => {
        this._$keyDown.notifyObservers(event)
      }

      _startRenderObservable(): void {
        addEventListener('keypress', this._eventKeyPress)
        addEventListener('keyup', this._eventKeyUp)
        addEventListener('keydown', this._eventKeyDown)
        this.babylon.scene.onPointerDown = (event: IPointerEvent) => {
          this._pointerPress = true
          this._pointerPressEvent = event
          this._$pointerDown.notifyObservers(event)
          if (this._pointerPressInterval) {
            this.clearInterval(this._pointerPressInterval)
          }
          this._pointerPressInterval = this.setInterval(() => {
            this._$pointerPress.notifyObservers(this._pointerPressEvent)
          }, 0)
        }
        this.babylon.scene.onPointerUp = (event: IPointerEvent) => {
          this._pointerPress = false
          this._$pointerUp.notifyObservers(event)
          if (this._pointerPressInterval) {
            this.clearInterval(this._pointerPressInterval)
          }
        }
        this.babylon.scene.onPointerMove = (event: IPointerEvent) => {
          this._pointerPressEvent = event
          this._$pointerMove.notifyObservers(event)
          if (this._pointerPress) {
            this._$pointerDrag.notifyObservers(event)
          }
        }
        this.babylon.scene.onBeforeRenderObservable.add(() => {
          this._animationHandler.forEach(handler => {
            handler()
          })
        })
      }

      _stopRenderObservable(): void {
        removeEventListener('keypress', this._eventKeyPress)
        removeEventListener('keyup', this._eventKeyUp)
        removeEventListener('keydown', this._eventKeyDown)
        this._pointerPress = false
        this._$pointerDown.clear()
        this._$pointerUp.clear()
        this._$pointerMove.clear()
        this._$pointerDrag.clear()
        this._$pointerPress.clear()
        this._$keyDown.clear()
        this._$keyUp.clear()
        this._$keyPress.clear()
        if (this._pointerPressInterval) {
          this.clearInterval(this._pointerPressInterval)
        }
        this.babylon.scene.onPointerDown = undefined
        this.babylon.scene.onPointerUp = undefined
        this.babylon.scene.onPointerMove = undefined
        this.babylon.scene.onBeforeRenderObservable.clear()
      }

      _releaseGUIs(): void {
        this._guis.forEach(gui => gui._release())
        this._guis.clear()
      }

      switchCamera(constructor: CameraConstructor, setup: any): CameraInterface {
        this.releaseCamera()
        this._cameraConstructor = constructor
        this._cameraSetup = setup
        this._camera = CamerasController.get(constructor).spawn(this)
        this._camera.setup = setup
        this._camera.babylon.camera = (this._camera.onInitialize as any)(this.babylon.scene)
        this._camera.babylon.camera.attachControl(Core.canvas, true)
        this._camera._start()
        return this._camera
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
        if (!this._availableElements.hasSceneState(state)) {
          Logger.error('Denied to set a state not available to the scene. Did you mean to add it to the scene props?', this.getClassName(), state.prototype)
          return null as any
        }
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

      playAction(actionConstructor: SceneActionConstructor, setup: any): SceneActionInterface {
        if (!this._availableElements.hasSceneAction(actionConstructor)) {
          Logger.error('Trying to play an action non available to the actor. Please check the actor props.', this.getClassName(), actionConstructor.prototype)
          return null as any
        }
        let action = this._actions.get(actionConstructor)
        if (!action) {
          action = SceneActionsController.get(actionConstructor).spawn(this)
          this._actions.set(actionConstructor, action)
          action._props.overrides?.forEach(actionOverride => {
            this.stopAction(actionOverride)
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

      getAction<C extends SceneActionConstructor>(actionConstructor: SceneActionConstructor): InstanceType<C> | undefined {
        return this._actions.get(actionConstructor) as InstanceType<C>
      }

      getActors<C extends ActorConstructor>(actor: ActorConstructor): InstanceType<C>[] {
        return this._actorsByType.get(actor) ?? [] as any
      }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this._metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }

      /**
       * Returns all available constructors in a props tree
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
                if (isPrototypeOf(ActorInterface, value)) { // IMPROVE insert all these constructors in a list and make generic method
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
    ScenesController.register(_class, new _class())
    return _class
  }
}
