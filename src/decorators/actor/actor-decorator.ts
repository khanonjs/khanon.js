import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import {
  ActorActionsController,
  ActorsController,
  ActorStatesController,
  MeshesController,
  ParticlesController,
  SpritesController
} from '../../controllers'
import { Rect } from '../../models/rect'
import { Logger } from '../../modules/logger'
import {
  FlexId,
  MeshTransform,
  SpriteTransform
} from '../../types'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeArrayDuplicitiesInObject,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { MeshAnimation } from '../mesh/mesh-animation'
import { MeshConstructor } from '../mesh/mesh-constructor'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleConstructor } from '../particle/particle-constructor'
import { ParticleInterface } from '../particle/particle-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from '../sprite/sprite-animation'
import { SpriteConstructor } from '../sprite/sprite-constructor'
import { SpriteInterface } from '../sprite/sprite-interface'
import { ActorActionConstructor } from './actor-action/actor-action-constructor'
import { ActorActionInterface } from './actor-action/actor-action-interface'
import { ActorCore } from './actor-core'
import { ActorInterface } from './actor-interface'
import { ActorProps } from './actor-props'
import { ActorStateConstructor } from './actor-state/actor-state-constructor'
import { ActorStateInterface } from './actor-state/actor-state-interface'

type B = SpriteInterface | MeshInterface

export function Actor(props: ActorProps = {}): any {
  return function <T extends { new (...args: any[]): ActorInterface }>(constructor: T & ActorInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements ActorInterface {
      constructor(readonly scene: SceneInterface) {
        super()
        this.metadata.applyProps(this)
      }

      initialize(props: ActorProps) {
        this.props = props
        invokeCallback(this.onSpawn, this)
      }

      props: ActorProps
      metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      transform: SpriteTransform | MeshTransform
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>
      _body?: B
      nodes?: Map<string, B> = new Map<string, B>()
      _state: ActorStateInterface
      actions: Map<ActorActionConstructor, ActorActionInterface> = new Map<ActorActionConstructor, ActorActionInterface>()
      particles: Map<FlexId, ParticleInterface> = new Map<FlexId, ParticleInterface>()

      onSpawn?(): void
      onDestroy?(): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(size: Rect): void

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }
      get body(): SpriteInterface | MeshInterface { return this._body }
      get state(): ActorStateInterface { return this._state }

      release() {
        invokeCallback(this.onDestroy, this)
        this.stopActionAll()
        this.clearParticles()
        this.clearNodes()
        removeLoopUpdate(this)
        removeCanvasResize(this)
      }

      setBody<B>(Body: new () => B): B {
        if (new Body() instanceof SpriteInterface) { // TODO is there a better way to do this avoiding the 'new'?
          if (!this.scene.availableElements.hasSprite(Body as SpriteConstructor)) { Logger.debugError('Trying to use a sprite non available to the actor. Please check the actor props.', this.constructor.prototype, Body.prototype); return }
          this._body = SpritesController.get(Body).spawn(this.scene) as any
        } else {
          if (!this.scene.availableElements.hasMesh(Body as MeshConstructor)) { Logger.debugError('Trying to use a mesh non available to the actor. Please check the actor props.', this.constructor.prototype, Body.prototype); return }
          this._body = MeshesController.get(Body).spawn(this.scene) as any
        }
        this.transform = this._body.transform
        attachLoopUpdate(this)
        attachCanvasResize(this)
        return this._body as B
      }

      removeBody(): void {
        if (this._body) {
          this._body.release()
          this._body = undefined
        }
      }

      addNode<B>(Node: B, name: string, offset: BABYLON.Vector3 | BABYLON.Matrix): B {
        // TODO
        // if (!name) {
        //   name = (++this.fakeId).toString()
        // }
        // if (this.nodes.get(name)) { Logger.debugError(`ActorCompositionDefinition - Adding a node with name already defined '${name}'`); return }
        return null
      }

      getNode(name: string): SpriteInterface | MeshInterface {
        // TODO
        return null
      }

      removeNode(name: string): void {
        // TODO
      }

      clearNodes(includeBody = true) {
        this.nodes.forEach(node => {
          node.release()
        })
        this.nodes.clear()
        if (includeBody) {
          this.removeBody()
        }
      }

      setVisible(value: boolean) {
        // TODO
      }

      startState(state: ActorStateConstructor, setup: any): void {
        if (!this.scene.availableElements.hasActorState(state)) { Logger.debugError('Trying to set a state non available to the actor. Please check the actor props.', _classInterface.prototype, state.prototype); return }
        const _state = ActorStatesController.get(state).spawn(this)
        if (this._state) {
          this._state.end()
        }
        this._state = _state
        this._state.start(setup)
      }

      playAnimation(animation: SpriteAnimation | MeshAnimation | FlexId, loopOverride?: boolean, completed?: () => void): void {
        this.body?.playAnimation(animation, loopOverride, completed)
      }

      stopAnimation(): void {
        this.body?.stopAnimation()
      }

      playAction(actionConstructor: ActorActionConstructor, setup: any): ActorActionInterface {
        if (!this.scene.availableElements.hasActorAction(actionConstructor)) { Logger.debugError('Trying to play an action non available to the actor. Please check the actor props.', _classInterface.prototype, actionConstructor.prototype); return }
        let action = this.actions.get(actionConstructor)
        if (!action) {
          action = ActorActionsController.get(actionConstructor).spawn(this)
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
          action.start(setup)
        }
        return action
      }

      getAction(actionConstructor: ActorActionConstructor): ActorActionInterface | undefined {
        return this.actions.get(actionConstructor)
      }

      stopActionFromInstance(instance: ActorActionInterface) {
        for (const [key, value] of this.actions.entries()) {
          if (value === instance) {
            this.stopAction(key)
            return
          }
        }
      }

      stopAction(actionConstructor: ActorActionConstructor): void {
        const action = this.actions.get(actionConstructor)
        if (action) {
          action.end()
          if (!action.props.preserve) {
            this.actions.delete(actionConstructor)
          }
        }
      }

      stopActionGroup(group: number): void {
        this.actions.forEach((action, actionConstructor) => {
          if (action.props.group !== undefined && action.props.group === group) {
            this.stopAction(actionConstructor)
          }
        })
      }

      stopActionAll(): void {
        this.actions.forEach((action, actionConstructor) => {
          this.stopAction(actionConstructor)
        })
      }

      attachParticle(particleConstructor: ParticleConstructor, id: FlexId, offset: BABYLON.Vector3 | BABYLON.Matrix, nodeName?: string): void {
        if (!this.scene.availableElements.hasParticle(particleConstructor)) { Logger.debugError('Trying to attach a particle non available to the actor. Please check the actor props.', _classInterface.prototype, particleConstructor.prototype); return }
        // 8a8f
        const particle = ParticlesController.get(particleConstructor).spawn(this.scene)
        this.particles.set(id, particle)
      }

      startParticle(id: FlexId): void {
        if (!this.particles.get(id)) { Logger.debugError(`Trying to start particle '${id}', but it doesn't exist in actor:`, _classInterface.prototype); return }
        this.particles.get(id).start()
      }

      stopParticle(id: FlexId): void {
        if (!this.particles.get(id)) { Logger.debugError(`Trying to start particle '${id}', but it doesn't exist in actor:`, _classInterface.prototype); return }
        this.particles.get(id).stop()
      }

      removeParticle(id: FlexId): void {
        if (!this.particles.get(id)) { Logger.debugError(`Trying to start particle '${id}', but it doesn't exist in actor:`, _classInterface.prototype); return }
        this.particles.get(id).release()
        this.particles.delete(id)
      }

      clearParticles(): void {
        this.particles.forEach((value: ParticleInterface, key: FlexId) => {
          this.removeParticle(key)
        })
      }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this.metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }

      destroy() {
        this.scene.remove.actor(this)
      }
    }
    const _classCore = class implements ActorCore {
      props = removeArrayDuplicitiesInObject(props)
      Instance: ActorInterface = new _classInterface(null)
      loaded = false

      load(scene: SceneInterface): LoadingProgress {
        const progress = new LoadingProgress().complete()
        ActorStatesController.load(this.props.states, scene)
        SpritesController.load(this.props.sprites, scene)
        SpritesController.load(this.Instance.metadata.getProps().sprites, scene)
        MeshesController.load(this.props.meshes, scene)
        MeshesController.load(this.Instance.metadata.getProps().meshes, scene)
        ActorActionsController.load(this.props.actions, scene)
        ActorActionsController.load(this.Instance.metadata.getProps().actions, scene)
        ParticlesController.load(this.props.particles, scene)
        ParticlesController.load(this.Instance.metadata.getProps().particles, scene)
        return progress
      }

      unload(scene: SceneInterface): void {
        ActorStatesController.unload(this.props.states, scene)
        SpritesController.unload(this.props.sprites, scene)
        SpritesController.unload(this.Instance.metadata.getProps().sprites, scene)
        MeshesController.unload(this.props.meshes, scene)
        MeshesController.unload(this.Instance.metadata.getProps().meshes, scene)
        ActorActionsController.unload(this.props.actions, scene)
        ActorActionsController.unload(this.Instance.metadata.getProps().actions, scene)
        ParticlesController.unload(this.props.particles, scene)
        ParticlesController.unload(this.Instance.metadata.getProps().particles, scene)
      }

      spawn(scene: SceneInterface): ActorInterface {
        const actor = new _classInterface(scene)
        actor.initialize(this.props)
        return actor
      }
    }
    ActorsController.register(new _classCore())
    return _classInterface
  }
}
