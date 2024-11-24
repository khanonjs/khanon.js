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
import { TransformComposition } from '../../models/transform-composition'
import { Arrays } from '../../modules/helper/arrays'
import { Helper } from '../../modules/helper/helper'
import { Logger } from '../../modules/logger'
import { FlexId } from '../../types/flex-id'
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
import { ActorNode } from './actor-node'
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
        this.visibility = props.visibility ?? 1
        invokeCallback(this.onSpawn, this)
      }

      props: ActorProps
      metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      transform: SpriteInterface | MeshInterface | null
      t: SpriteInterface | MeshInterface | null
      _loopUpdate: boolean
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>
      _body: B | null = null
      nodes: Map<string, ActorNode<B>> = new Map<string, ActorNode<B>>()
      _visibility = 1
      _state: ActorStateInterface | null = null
      actions: Map<ActorActionConstructor, ActorActionInterface> = new Map<ActorActionConstructor, ActorActionInterface>()
      particles: Map<FlexId, ParticleInterface> = new Map<FlexId, ParticleInterface>()

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return this._loopUpdate }
      get body(): SpriteInterface | MeshInterface | null { return this._body }
      get state(): ActorStateInterface | null { return this._state }

      set visibility(value: number) {
        this._visibility = value
        if (this.body) {
          this.body.visibility = value
        }
        this.nodes.forEach(node => { node.element.visibility = value })
      }

      get visibility(): number {
        return this._visibility
      }

      release() {
        invokeCallback(this.onDestroy, this)
        this.stopActionAll()
        this.clearParticles()
        this.removeBody()
        removeLoopUpdate(this)
        removeCanvasResize(this)
      }

      getNodeElement<N extends B>(Element: new () => N): N {
        if (new Element() instanceof SpriteInterface) { // TODO is there a better way to do this avoiding the 'new'?
          if (!this.scene.availableElements.hasSprite(Element as SpriteConstructor)) { Logger.debugError('Trying to use a sprite non available to the actor. Please check the actor props.', this.constructor.prototype, Element.prototype); return null as any }
          return SpritesController.get(Element).spawn(this.scene) as any
        } else {
          if (!this.scene.availableElements.hasMesh(Element as MeshConstructor)) { Logger.debugError('Trying to use a mesh non available to the actor. Please check the actor props.', this.constructor.prototype, Element.prototype); return null as any }
          return MeshesController.get(Element).spawn(this.scene) as any
        }
      }

      setBody<N extends B>(Body: new () => N): N {
        if (this._body) {
          this.removeBody()
        }
        this._body = this.getNodeElement(Body)
        this._body.visibility = this.visibility
        if (this.props.renderingGroupId) {
          this._body.babylon.mesh.renderingGroupId = this.props.renderingGroupId
        }
        this.transform = this._body
        this.t = this.transform
        attachLoopUpdate(this)
        attachCanvasResize(this)
        return this._body as N
      }

      removeBody(): void {
        if (this._body) {
          this.clearNodes()
          this._body.release()
          this._body = null
        }
      }

      addNode<N extends B>(Node: new () => N, name: string, transform?: TransformComposition, parentName?: string): ActorNode<B> | undefined {
        if (!this._body) { Logger.debugError(`Cannot add node '${name}' without a body.`, _classInterface.prototype); return undefined }
        if (this.nodes.has(name)) { Logger.warn(`Trying to add node '${name}' that already exists.`, _classInterface.prototype); return this.nodes.get(name) }
        if (name === 'boneRoot' || parentName === 'boneRoot') { Logger.debugError('Cannot use \'boneRoot\' as node \'name\' or \'parentName\'.', _classInterface.prototype); return undefined }
        if (parentName && this.nodes.size === 0) { Logger.debugError('Cannot use \'parentName\' without a previous added node.', _classInterface.prototype); return undefined }
        const element = this.getNodeElement(Node)
        if (element) {
          if (!this._body.babylon.mesh.skeleton) {
            this._body.babylon.mesh.skeleton = new BABYLON.Skeleton('skeleton', '', this.scene.babylon.scene)
            const boneRoot = new BABYLON.Bone('boneRoot', this._body.babylon.mesh.skeleton, null, BABYLON.Matrix.Identity())
          }
          const boneParentIndex = this._body.babylon.mesh.skeleton.getBoneIndexByName(parentName ?? 'boneRoot')
          const bone = new BABYLON.Bone(name, this._body.babylon.mesh.skeleton, this._body.babylon.mesh.skeleton.bones[boneParentIndex], BABYLON.Matrix.Identity())
          element.babylon.mesh.billboardMode = 0
          element.babylon.mesh.attachToBone(bone, this._body.babylon.mesh)

          const node = { element, bone }
          this.nodes.set(name, node)
          if (this.props.renderingGroupId) {
            element.babylon.mesh.renderingGroupId = this.props.renderingGroupId
          }
          element.visibility = this._visibility
          if (transform?.position) {
            bone.setPosition(transform.position)
          }
          if (transform?.rotation) {
            bone.setRotation(transform.rotation)
          }
          if (transform?.scale) {
            bone.scale(transform.scale.x, transform.scale.y, transform.scale.z)
          }
          return node
        } else {
          return undefined
        }
      }

      getNode(name: string): ActorNode<B> | undefined {
        return this.nodes.get(name)
      }

      removeNode(name: string): void {
        const node = this.nodes.get(name)
        if (node) {
          const array = [...node.bone.children]
          array.forEach(bone => {
            this.removeNode(bone.name)
          })
          node.element.release()
          node.bone.dispose()
          this.nodes.delete(name)
          if (this._body && this.nodes.size <= 0) {
            this._body.babylon.mesh.skeleton?.dispose()
            this._body.babylon.mesh.skeleton = null
          }
        }
      }

      clearNodes() {
        this.nodes.forEach(node => {
          node.element.release()
          node.bone.dispose()
        })
        this.nodes.clear()
        if (this._body) {
          this._body.babylon.mesh.skeleton?.dispose()
          this._body.babylon.mesh.skeleton = null
        }
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
        } else {
          action.play()
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
          Logger.trace('aki remove loop update')
          action._isPlaying = false
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
        const attachmentSprite = nodeName ? this.getNode(nodeName)?.element : this.body
        if (!attachmentSprite) { Logger.debugError('Cannot attach a particle to an empty body.', _classInterface.prototype, particleConstructorOrMethod.prototype); return }
        if (!this.scene.availableElements.hasParticle(particleConstructorOrMethod as ParticleConstructor)) { Logger.debugError('Trying to attach a particle non available to the actor. Please check the actor props.', _classInterface.prototype, particleConstructorOrMethod.prototype); return }
        const particle = ParticlesController.get(particleConstructorOrMethod).spawn(this.scene, { attachment: attachmentSprite, offset }, !isMethod)

        if (isMethod) {
          // Applies context to 'onInitialize' as caller 'Actor' to preserve the 'this'
          // in case 'initialize' is equivalent to a decorated method of some of those both interfaces.
          particle.onInitialize = particle.onInitialize?.bind(this)
          particle.create()
        }
        if (this.props.renderingGroupId) {
          particle.babylon.particleSystem.renderingGroupId = this.props.renderingGroupId
        }
        // TODO visibility should affect to particles, is it possible?
        this.particles.set(id, particle)
      }

      startParticle(id: FlexId): void {
        if (!this.particles.get(id)) { Logger.debugError(`Trying to start particle '${id}' that doesn't exist in actor:`, _classInterface.prototype); return }
        if (this.visibility > 0) {
          this.particles.get(id)?.start()
        }
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
