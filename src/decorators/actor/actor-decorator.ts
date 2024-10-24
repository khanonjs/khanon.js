import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { MetadataParticleDefinition } from '../../base/interfaces/metadata/metadata-particle-definition'
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
import { FlexId } from '../../types/flex-id'
import { MeshTransform } from '../../types/mesh-transform'
import { SpriteTransform } from '../../types/sprite-transform'
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
      transform: SpriteTransform | MeshTransform | null
      t: SpriteTransform | MeshTransform | null
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>
      _body: B | null = null
      nodes: Map<string, B> = new Map<string, B>()
      _state: ActorStateInterface | null = null
      actions: Map<ActorActionConstructor, ActorActionInterface> = new Map<ActorActionConstructor, ActorActionInterface>()
      particles: Map<FlexId, ParticleInterface> = new Map<FlexId, ParticleInterface>()

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }
      get body(): SpriteInterface | MeshInterface | null { return this._body }
      get state(): ActorStateInterface | null { return this._state }

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
          if (!this.scene.availableElements.hasSprite(Body as SpriteConstructor)) { Logger.debugError('Trying to use a sprite non available to the actor. Please check the actor props.', this.constructor.prototype, Body.prototype); return null as any }
          this._body = SpritesController.get(Body).spawn(this.scene) as any
        } else {
          if (!this.scene.availableElements.hasMesh(Body as MeshConstructor)) { Logger.debugError('Trying to use a mesh non available to the actor. Please check the actor props.', this.constructor.prototype, Body.prototype); return null as any }
          this._body = MeshesController.get(Body).spawn(this.scene) as any
        }
        this.transform = this._body?.transform ?? null
        this.t = this.transform
        attachLoopUpdate(this)
        attachCanvasResize(this)
        return this._body as B
      }

      removeBody(): void {
        if (this._body) {
          this._body.release()
          this._body = null
        }
      }

      addNode<B>(Node: new () => B, name: string, transform?: BABYLON.Vector3 | BABYLON.Matrix): B {
        // TODO
        // if (!name) {
        //   name = (++this.fakeId).toString()
        // }
        // if (this.nodes.get(name)) { Logger.debugError(`ActorCompositionDefinition - Adding a node with name already defined '${name}'`); return }
        return null as any
      }

      getNode(name: string): SpriteInterface | MeshInterface {
        // TODO
        return null as any
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

      switchState(state: ActorStateConstructor, setup: any): ActorStateInterface {
        if (!this.scene.availableElements.hasActorState(state)) { Logger.debugError('Trying to set a state non available to the actor. Please check the actor props.', _classInterface.prototype, state.prototype); return null as any }
        const _state = ActorStatesController.get(state).spawn(this)
        if (this._state) {
          this._state.end()
        }
        this._state = _state
        this._state.start(setup)
        return this._state
      }

      playAnimation(animation: SpriteAnimation | MeshAnimation | FlexId, loopOverride?: boolean, completed?: () => void): void {
        this.body?.playAnimation(animation, loopOverride, completed)
      }

      stopAnimation(): void {
        this.body?.stopAnimation()
      }

      getActionOwner(actionConstructor: ActorActionConstructor): ActorInterface | ActorStateInterface | undefined {
        return this.metadata.getProps().actions?.find(_action => _action === actionConstructor)
          ? this
          : this._state?.metadata?.getProps().actions?.find(_action => _action === actionConstructor)
            ? this._state
            : undefined
      }

      playAction(actionConstructor: ActorActionConstructor, setup: any): ActorActionInterface {
        if (!this.scene.availableElements.hasActorAction(actionConstructor)) { Logger.debugError('Trying to play an action non available to the actor. Please check the actor props.', _classInterface.prototype, actionConstructor.prototype); return null as any }
        let action = this.actions.get(actionConstructor)
        if (!action) {
          action = ActorActionsController.get(actionConstructor).spawn(this)
          let actionOwner: any
          if (!this.props.actions?.find(_action => _action === actionConstructor)) {
            // Applies context 'ActorInterface' or 'ActorStateInterface' to 'onLoopUpdate' method to preserve the 'this'
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

      playActionFromInstance(instance: ActorActionInterface): void {
        for (const [key, value] of this.actions.entries()) {
          if (value === instance) {
            this.playAction(key, {})
            return
          }
        }
      }

      stopActionFromInstance(instance: ActorActionInterface, forceRemove?: boolean) {
        for (const [key, value] of this.actions.entries()) {
          if (value === instance) {
            this.stopAction(key, forceRemove)
            return
          }
        }
      }

      stopAction(actionConstructor: ActorActionConstructor, forceRemove?: boolean): void {
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

      getAction(actionConstructor: ActorActionConstructor): ActorActionInterface | undefined {
        return this.actions.get(actionConstructor)
      }

      attachParticle(particleConstructorOrMethod: ParticleConstructor | ((particle: ParticleInterface) => void), id: FlexId, offset: BABYLON.Vector3, nodeName?: string): void {
        let isMethod = false
        if (!particleConstructorOrMethod.prototype?.constructor) {
          isMethod = true
          this.metadata.particles.forEach((value: MetadataParticleDefinition) => {
            particleConstructorOrMethod = value.classDefinition
          })
        }
        const attachmentSprite = nodeName ? this.getNode(nodeName) : this.body
        if (!attachmentSprite) { Logger.debugError('Cannot attach a particle to an empty body.', _classInterface.prototype, particleConstructorOrMethod.prototype); return }
        if (!this.scene.availableElements.hasParticle(particleConstructorOrMethod as ParticleConstructor)) { Logger.debugError('Trying to attach a particle non available to the actor. Please check the actor props.', _classInterface.prototype, particleConstructorOrMethod.prototype); return }
        const particle = ParticlesController.get(particleConstructorOrMethod).spawn(this.scene, { attachment: attachmentSprite, offset }, !isMethod)
        if (isMethod) {
          // Applies context to 'onInitialize' as caller 'Actor' to preserve the 'this'
          // in case 'initialize' is equivalent to a decorated method of some of those both interfaces.
          particle.onInitialize = particle.onInitialize?.bind(this)
          particle.create()
        }
        this.particles.set(id, particle)
      }

      startParticle(id: FlexId): void {
        if (!this.particles.get(id)) { Logger.debugError(`Trying to start particle '${id}' that doesn't exist in actor:`, _classInterface.prototype); return }
        this.particles.get(id)?.start()
      }

      stopParticle(id: FlexId): void {
        if (!this.particles.get(id)) { Logger.debugError(`Trying to start particle '${id}' that doesn't exist in actor:`, _classInterface.prototype); return }
        this.particles.get(id)?.stop()
      }

      removeParticle(id: FlexId): void {
        if (!this.particles.get(id)) { Logger.debugError(`Trying to start particle '${id}' that doesn't exist in actor:`, _classInterface.prototype); return }
        this.particles.get(id)?.release()
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
      Instance: ActorInterface = new _classInterface(null as any)
      loaded = false

      load(scene: SceneInterface): LoadingProgress {
        return new LoadingProgress().fromNodes([
          ActorStatesController.load(this.props.states, scene),
          ActorActionsController.load(this.props.actions, scene),
          ActorActionsController.load(this.Instance.metadata.getProps().actions, scene),
          SpritesController.load(this.props.sprites, scene),
          SpritesController.load(this.Instance.metadata.getProps().sprites, scene),
          MeshesController.load(this.props.meshes, scene),
          MeshesController.load(this.Instance.metadata.getProps().meshes, scene),
          ParticlesController.load(this.props.particles, scene),
          ParticlesController.load(this.Instance.metadata.getProps().particles, scene)
        ])
      }

      unload(scene: SceneInterface): void {
        ActorStatesController.unload(this.props.states, scene)
        ActorActionsController.unload(this.props.actions, scene)
        ActorActionsController.unload(this.Instance.metadata.getProps().actions, scene)
        SpritesController.unload(this.props.sprites, scene)
        SpritesController.unload(this.Instance.metadata.getProps().sprites, scene)
        MeshesController.unload(this.props.meshes, scene)
        MeshesController.unload(this.Instance.metadata.getProps().meshes, scene)
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
