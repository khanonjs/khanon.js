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
        this.metadata.applyProps(this)
        this.storeAvailableElements()
      }

      getClassName(): string {
        return constructor.name
      }

      props = removeArrayDuplicitiesInObject(applyDefaults(props, scenePropsDefault))
      metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      actions: Map<SceneActionConstructor, SceneActionInterface> = new Map<SceneActionConstructor, SceneActionInterface>()
      availableElements: SceneAvailableElements
      animationHandler: Map<SpriteInterface, () => void> = new Map<SpriteInterface, () => void>()
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
      actors: Set<ActorInterface> = new Set<ActorInterface>()
      meshes: Set<MeshInterface> = new Set<MeshInterface>()
      sprites: Set<SpriteInterface> = new Set<SpriteInterface>()
      particles: Set<ParticleInterface> = new Set<ParticleInterface>()
      guis: Map<GUIConstructor, GUIInterface> = new Map<GUIConstructor, GUIInterface>()

      setEngineParams(): void {} // TODO ?

      // User available
      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null as any }
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>
      get assets(): AssetDefinition[] { return this._assets }
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
        if (Core.isDevelopmentMode() && this.props.useDebugInspector) {
          this.useDebugInspector()
        }
        Core.startRenderScene(this)
        this.startRenderObservable()
        switchLoopUpdate(this._loopUpdate, this)
        attachCanvasResize(this)
        return this.state
      }

      stop(): void {
        Logger.debug('Scene stop', this.getClassName())
        if (Core.isDevelopmentMode()) {
          this.denyDebugInspector()
        }
        this.releaseGUIs()
        this.releaseCamera()
        this.state?.end()
        this.remove.all()
        this._started = false
        Core.stopRenderScene(this)
        this.stopRenderObservable()
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
          this.babylon.scene = new BABYLON.Scene(Core.engine, this.props.options)

          this._loadingProgress = new LoadingProgress()
          if (!this.assets) {
            this._assets = [
              ...AssetsController.findAssetsDefinitions(this.props),
              ...AssetsController.findAssetsDefinitions(this.metadata.getProps())
            ]
          }
          const assetsProgress = AssetsController.sceneLoad(this)
          assetsProgress.onComplete.add(() => {
            Logger.debug('Scene assets load completed', this.getClassName())
            const elementsLoading = new LoadingProgress().fromNodes([
              SceneStatesController.load(this.props.states, this),
              SceneActionsController.load(this.props.actions, this),
              SceneActionsController.load(this.metadata.getProps().actions, this),
              ActorsController.load(this.props.actors, this),
              SpritesController.load(this.props.sprites, this),
              SpritesController.load(this.metadata.getProps().sprites, this),
              MeshesController.load(this.props.meshes, this),
              MeshesController.load(this.metadata.getProps().meshes, this),
              ParticlesController.load(this.props.particles, this),
              ParticlesController.load(this.metadata.getProps().particles, this),
              GUIController.load(this.props.guis, this)
            ])
            elementsLoading.onComplete.add(() => {
              Logger.debug('Scene elements load completed', this.getClassName())
              const startScene = () => {
                // Load configuration after Elements loading, to avoid AppendAsync method to override these configurations.
                if (this.props.configuration) {
                  for (const [key, value] of Object.entries(this.props.configuration)) {
                    this.babylon.scene[key] = value
                  }
                }
                this.babylon.scene.executeWhenReady(() => {
                  this._loaded = true
                  invokeCallback(this.onLoaded, this)
                  this.availableElements.actors.forEach(actorConsctructor => {
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
                            this.availableElements.meshes.add(NewMesh)
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
              if (this.props.url) {
                BABYLON.AppendSceneAsync(this.props.url, this.babylon.scene)
                  .then(() => {
                    Logger.debug(`Scene load  AppendAsync from '${this.props.url}' completed.`, this.getClassName())
                    startScene()
                  })
                  .catch((error: string) => {
                    Logger.debugError(`Scene load AppendAsync from '${this.props.url}' error`, error, this.getClassName())
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
        GUIController.unload(this.props.guis, this)
      }

      showGUI<G extends GUIInterface>(gui: GUIConstructor, setup: any): G {
        Logger.debug('Show GUI', this.getClassName(), GUIController.get(gui).getClassName())
        let guiInstance = this.guis.get(gui)
        if (guiInstance) {
          guiInstance.release()
        }
        guiInstance = GUIController.get(gui).spawn(this)
        guiInstance.initialize(setup)
        this.guis.set(gui, guiInstance)
        return guiInstance as any
      }

      hideGUI(gui: GUIConstructor): void {
        Logger.debug('Hide GUI', this.getClassName(), GUIController.get(gui).getClassName())
        const guiInstance = this.guis.get(gui)
        if (guiInstance) {
          guiInstance.release()
          this.guis.delete(gui)
        } else {
          Logger.warn('Trying to hide a GUI that\'s not being displayed.', this.getClassName(), GUIController.get(gui).getClassName())
        }
      }

      getGUI<G extends GUIInterface>(gui: GUIConstructor): G | undefined {
        return this.guis.get(gui) as any
      }

      startRenderObservable(): void {
        this.babylon.scene.onBeforeRenderObservable.add(() => {
          this.animationHandler.forEach(handler => {
            handler()
          })
        })
      }

      stopRenderObservable(): void {
        this.babylon.scene.onBeforeRenderObservable.clear()
      }

      releaseGUIs(): void {
        this.guis.forEach(gui => gui.release())
        this.guis.clear()
      }

      switchCamera(constructor: CameraConstructor, setup: any): void {
        this.releaseCamera()
        this._cameraConstructor = constructor
        this._cameraSetup = setup
        this._camera = CamerasController.get(constructor).spawn(this)
        this._camera.setup = setup
        this._camera.babylon.camera = (this._camera.onInitialize as any)(this.babylon.scene)
        this._camera.babylon.camera.attachControl(Core.canvas, true)
        this._camera.start()
      }

      releaseCamera(): void {
        if (this._camera) {
          this._camera.release()
          this._camera.babylon.camera.detachControl()
          this._camera = undefined
          this.babylon.scene.activeCamera = null
        }
      }

      getCamera<C extends CameraInterface = CameraInterface>(): C {
        return this._camera as C
      }

      switchState(state: SceneStateConstructor, setup: any): SceneStateInterface {
        if (!this.availableElements.hasSceneState(state)) { Logger.debugError('Denied to set a state not available to the scene. Did you mean to add it to the scene props?', this.getClassName(), state.prototype); return null as any }
        const _state = SceneStatesController.get(state).spawn(this)
        if (this._state) {
          this._state.end()
        }
        this._state = _state
        this._state.start(setup)
        return this._state
      }

      setAnimationHandler(sprite: SpriteInterface, animation: SpriteAnimation): void {
        const startMs = Core.getLoopUpdateLastMs()
        const numSprites = animation.frameEnd - animation.frameStart
        const totalTimeMs = numSprites * animation.delay
        const handleLoop = () => {
          sprite.setShaderMaterialTextureFrame(animation.frameStart + (Math.trunc(((Core.getLoopUpdateLastMs() - startMs) % totalTimeMs) / animation.delay)))
        }
        const handleNoLoop = () => {
          const loopUpdateLastMs = Core.getLoopUpdateLastMs()
          if (loopUpdateLastMs - startMs >= totalTimeMs) {
            sprite.setShaderMaterialTextureFrame(animation.frameEnd)
            this.animationHandler.delete(sprite)
          } else {
            sprite.setShaderMaterialTextureFrame(animation.frameStart + (Math.trunc(((Core.getLoopUpdateLastMs() - startMs) % totalTimeMs) / animation.delay)))
          }
        }
        this.animationHandler.set(sprite, animation.loop ? handleLoop : handleNoLoop)
      }

      stopAnimationHandler(sprite: SpriteInterface): void {
        this.animationHandler.delete(sprite)
      }

      getActionOwner(actionConstructor: SceneActionConstructor): SceneInterface | SceneStateInterface | undefined {
        return this.metadata.getProps().actions?.find(_action => _action === actionConstructor)
          ? this
          : this._state?.metadata?.getProps().actions?.find(_action => _action === actionConstructor)
            ? this._state
            : undefined
      }

      playAction(actionConstructor: SceneActionConstructor, setup: any): SceneActionInterface {
        if (!this.availableElements.hasSceneAction(actionConstructor)) { Logger.debugError('Trying to play an action non available to the actor. Please check the actor props.', this.getClassName(), actionConstructor.prototype); return null as any }
        let action = this.actions.get(actionConstructor)
        if (!action) {
          action = SceneActionsController.get(actionConstructor).spawn(this)
          let actionOwner: any
          if (!this.props.actions?.find(_action => _action === actionConstructor)) {
            // Applies context 'Scene' or 'SceneState' to 'onLoopUpdate' method to preserve the 'this'
            // in case 'onLoopUpdate' is equivalent to a decorated method of some of those both interfaces.
            actionOwner = this.getActionOwner(actionConstructor)
            action.onLoopUpdate = action.onLoopUpdate?.bind(actionOwner)
          }
          this.actions.set(actionConstructor, action)
          action.props.overrides?.forEach(actionOverride => {
            if (typeof actionOverride === 'string') {
              const overrideConstructor = this.getActionOwner(actionConstructor)?.metadata.actions.find(_action => _action.methodName === actionOverride)?.classDefinition
              if (!overrideConstructor) { Logger.debugError(`Action class method not found to override: '${actionOverride}'`) }
              if (actionConstructor) {
                this.stopAction(overrideConstructor)
              }
            } else {
              this.stopAction(actionOverride)
            }
          })
          action.start(setup)
        }
        return action
      }

      playActionFromInstance(instance: SceneActionInterface): void {
        for (const [key, value] of this.actions.entries()) {
          if (value === instance) {
            this.playAction(key, {})
            return
          }
        }
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

      playActionGroup(group: FlexId): void {
        this.actions.forEach((action, actionConstructor) => {
          if (action.props.group !== undefined && action.props.group === group) {
            this.playAction(actionConstructor, {})
          }
        })
      }

      stopActionGroup(group: FlexId, forceRemove?: boolean): void {
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

      removeActionGroup(group: FlexId): void {
        this.stopActionGroup(group, true)
      }

      removeActionAll(): void {
        this.stopActionAll(true)
      }

      getAction(actionConstructor: SceneActionConstructor): SceneActionInterface | undefined {
        return this.actions.get(actionConstructor)
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

      useDebugInspector(): void {
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

      denyDebugInspector(): void {
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
