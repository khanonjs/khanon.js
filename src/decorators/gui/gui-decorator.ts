import * as BABYLON from '@babylonjs/core'

import {
  LoadingProgress,
  Metadata
} from '../../base'
import {
  GUIController,
  MeshesController,
  ParticlesController,
  SpritesController
} from '../../controllers'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { FlexId } from '../../types/flex-id'
import {
  invokeCallback,
  removeArrayDuplicitiesInObject,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { ParticleInterface } from '../particle/particle-interface'
import { SceneInterface } from '../scene/scene-interface'
import { GUICore } from './gui-core'
import { GUIInterface } from './gui-interface'
import { GUIProps } from './gui-props'
import { GUIStateConstructor } from './gui-state/gui-state-constructor'
import { GUIStateInterface } from './gui-state/gui-state-interface'

export function GUI(props: GUIProps = {}): any {
  return function <T extends { new (...args: any[]): GUIInterface }>(constructor: T & GUIInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements GUIInterface {
      constructor(readonly scene: SceneInterface) {
        super()
        this.metadata.applyProps(this)
      }

      props: GUIProps
      metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      setup: any
      babylon: Pick<BabylonAccessor<BABYLON.Camera>, 'gui' | 'scene'>
      _loopUpdate: boolean
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>
      _state: GUIStateInterface | null = null
      particles: Map<FlexId, ParticleInterface> = new Map<FlexId, ParticleInterface>()

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return this._loopUpdate }
      get state(): GUIStateInterface | null { return this._state }

      release() {
        // invokeCallback(this.onDestroy, this)
        removeLoopUpdate(this)
        removeCanvasResize(this)
      }

      start(): void {

      }

      stop(): void {

      }

      show(): void {

      }

      hide(): void {

      }

      switchState(state: GUIStateConstructor, setup: any): GUIStateInterface {
        /* if (!this.scene.availableElements.hasActorState(state)) { Logger.debugError('Trying to set a state non available to the actor. Please check the actor props.', _classInterface.prototype, state.prototype); return null as any }
        const _state = ActorStatesController.get(state).spawn(this)
        if (this._state) {
          this._state.end()
        }
        this._state = _state
        this._state.start(setup)
        return this._state */
        return null as any
      }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this.metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }

      destroy() {
        // this.scene.remove.actor(this)
      }
    }
    const _classCore = class implements GUICore {
      props = removeArrayDuplicitiesInObject(props)
      Instance: GUIInterface = new _classInterface(null as any)
      loaded = false

      load(scene: SceneInterface): LoadingProgress {
        return new LoadingProgress().fromNodes([
          SpritesController.load(this.props.sprites, scene),
          SpritesController.load(this.Instance.metadata.getProps().sprites, scene),
          MeshesController.load(this.props.meshes, scene),
          MeshesController.load(this.Instance.metadata.getProps().meshes, scene),
          ParticlesController.load(this.props.particles, scene),
          ParticlesController.load(this.Instance.metadata.getProps().particles, scene)
        ])
      }

      unload(scene: SceneInterface): void {
        SpritesController.unload(this.props.sprites, scene)
        SpritesController.unload(this.Instance.metadata.getProps().sprites, scene)
        MeshesController.unload(this.props.meshes, scene)
        MeshesController.unload(this.Instance.metadata.getProps().meshes, scene)
        ParticlesController.unload(this.props.particles, scene)
        ParticlesController.unload(this.Instance.metadata.getProps().particles, scene)
      }

      spawn(scene: SceneInterface): GUIInterface {
        const actor = new _classInterface(scene)
        // actor.initialize(this.props)
        return actor
      }
    }
    GUIController.register(new _classCore())
    return _classInterface
  }
}
