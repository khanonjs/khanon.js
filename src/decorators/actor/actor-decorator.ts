import { Bone } from '@babylonjs/core/Bones/bone'
import { Skeleton } from '@babylonjs/core/Bones/skeleton'
import {
  Matrix,
  Vector3
} from '@babylonjs/core/Maths/math.vector'
import { Observer } from '@babylonjs/core/Misc/observable'

import { LoadingProgress } from '../../base'
import { Core } from '../../base/core/core'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { MetadataParticleDefinition } from '../../base/interfaces/metadata/metadata-particle-definition'
import {
  ActorActionsController,
  ActorsController,
  ActorStatesController,
  MeshesController,
  ParticlesController,
  SoundsController,
  SpritesController
} from '../../controllers'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { TransformComposition } from '../../models/transform-composition'
import { Logger } from '../../modules/logger'
import { FlexId } from '../../types/flex-id'
import {
  attachCanvasResize,
  invokeCallback,
  removeArrayDuplicitiesInObject,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { MeshAnimationOptions } from '../mesh/mesh-animation-options'
import { MeshConstructor } from '../mesh/mesh-constructor'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleConstructor } from '../particle/particle-constructor'
import { ParticleInterface } from '../particle/particle-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SoundInterface } from '../sound/sound-interface'
import { SpriteAnimationOptions } from '../sprite/sprite-animatrion-options'
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
    const className = constructor.name
    const _classInterface = class extends constructor implements ActorInterface {
      constructor(readonly scene: SceneInterface) {
        super()
        if (this.scene) {
          this.babylon.scene = this.scene.babylon.scene
          this._metadata.applyProps(this, this.scene)
        }
      }

      getClassName(): string { return className }

      setTimeout(func: () => void, ms: number): Timeout { return Core.setTimeout(func, ms, this) }
      setInterval(func: () => void, ms: number): Timeout { return Core.setInterval(func, ms, this) }
      clearTimeout(timeout: Timeout): void { Core.clearTimeout(timeout) }
      clearInterval(interval: Timeout): void { Core.clearInterval(interval) }
      clearAllTimeouts(): void { Core.clearAllTimeoutsByContext(this) }

      _props: ActorProps
      _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null as any }
      transform: SpriteInterface | MeshInterface | null
      t: SpriteInterface | MeshInterface | null
      _loopUpdate = true
      _loopUpdate$: Observer<number>
      _canvasResize$: Observer<Rect>
      _started = false
      _updating = false
      _enabled = false
      _body: B | null = null
      _nodes: Map<string, ActorNode<B>> = new Map<string, ActorNode<B>>()
      _visibility = 1
      _state: ActorStateInterface | null = null
      _actions: Map<ActorActionConstructor, ActorActionInterface> = new Map<ActorActionConstructor, ActorActionInterface>()
      _particles: Map<FlexId, ParticleInterface> = new Map<FlexId, ParticleInterface>()
      // guis: Set<GUIInterface> = new Set<GUIInterface>()

      set loopUpdate(value: boolean) {
        this._loopUpdate = value
        switchLoopUpdate(this._loopUpdate, this)
      }

      get loopUpdate(): boolean { return this._loopUpdate }
      get body(): SpriteInterface | MeshInterface | null { return this._body }
      get state(): ActorStateInterface | null { return this._state }

      set visibility(value: number) {
        this._visibility = value
        if (this.body) {
          this.body.visibility = value
        }
        this._nodes.forEach(node => { node.element.visibility = value })
      }

      get visibility(): number {
        return this._visibility
      }

      get enabled(): boolean {
        return this._enabled
      }

      set enabled(value: boolean) {
        this._enabled = value
        if (this.body) {
          this.body.enabled = this._enabled
        }
        this._nodes.forEach(node => {
          node.element.enabled = this._enabled
        })
        if (this._enabled) {
          this._startUpdates()
        } else {
          this._stopUpdates()
        }
      }

      _applyStarted() {
        if (this.enabled && !this._started && this.scene.started) {
          this._started = true
          invokeCallback(this.onStart, this)
        }
      }

      _initialize(props: ActorProps) {
        this._props = props
        // this.guisStart()
        invokeCallback(this.onSpawn, this)
        this.enabled = props.enabled ?? true
      }

      _startUpdates(): void {
        if (!this._updating) {
          this._updating = true
          this._applyStarted()
          this._metadata.startInputEvents()
          switchLoopUpdate(this._loopUpdate, this)
          attachCanvasResize(this)
        }
      }

      _stopUpdates(): void {
        if (this._updating) {
          this._updating = false
          this._metadata.stopInputEvents()
          removeLoopUpdate(this)
          removeCanvasResize(this)
        }
      }

      _release() {
        this.clearAllTimeouts()
        invokeCallback(this.onDestroy, this)
        this._stopUpdates()
        this.stopActionAll()
        // this.guisRelease()
        this.state?._end()
        this.clearParticles()
        this._removeBody()
      }

      // guisStart(): void {
      //   this.props.guis?.forEach(_gui => {
      //     const gui = GUIController.get(_gui).spawn()
      //     gui.initialize()
      //     this.guis.add(gui)
      //   })
      // }

      // guisRelease(): void {
      //   this.guis.forEach(gui => gui.release())
      //   this.guis.clear()
      // }

      _getSpatialSounds(): SoundInterface[] {
        const sounds: SoundInterface[] = []
        this._metadata.getProps().sounds?.forEach(soundC => {
          const sound = SoundsController.get(soundC)
          if (sound._props.spatialEnabled) {
            sounds.push(sound)
          }
        })
        const actions = ActorActionsController.get(this._props.actions ?? [])
        actions.forEach(action => {
          action.Instance._metadata.getProps().sounds?.forEach(soundC => {
            const sound = SoundsController.get(soundC)
            if (sound._props.spatialEnabled) {
              sounds.push(sound)
            }
          })
        })
        const states = ActorStatesController.get(this._props.states ?? [])
        states.forEach(state => {
          state.Instance._metadata.getProps().sounds?.forEach(soundC => {
            const sound = SoundsController.get(soundC)
            if (sound._props.spatialEnabled) {
              sounds.push(sound)
            }
          })
        })
        return sounds
      }

      _getNodeElement<N extends B>(Element: new () => N): N {
        if (new Element() instanceof SpriteInterface) { // IMPROVE there a better way to do this avoiding the 'new'?
          if (process.env.NODE_ENV !== 'production' && !this.scene._availableElements.hasSprite(Element as SpriteConstructor)) { Logger.debugError('Trying to use a sprite non available to the actor. Please check the actor props.', this.getClassName(), Element.prototype); return null as any }
          return SpritesController.get(Element).spawn(this.scene) as any
        } else {
          if (process.env.NODE_ENV !== 'production' && !this.scene._availableElements.hasMesh(Element as MeshConstructor)) { Logger.debugError('Trying to use a mesh non available to the actor. Please check the actor props.', this.getClassName(), Element.prototype); return null as any }
          return MeshesController.get(Element).spawn(this.scene) as any
        }
      }

      setBody<N extends B>(Body: new () => N): N {
        if (this._body) {
          this._removeBody()
        }
        this._body = this._getNodeElement(Body)
        this._body.enabled = this._enabled
        this._body.visibility = this.visibility
        if (this._props.renderingGroupId) {
          this._body.babylon.mesh.renderingGroupId = this._props.renderingGroupId
          this._body.babylon.mesh.getChildMeshes().forEach(child => { child.renderingGroupId = this._props.renderingGroupId ?? 0 })
        }
        this.transform = this._body
        this.t = this.transform
        if (this._enabled) {
          this._startUpdates()
        }
        this._getSpatialSounds().forEach(sound => {
          sound.sound.spatial.attach(this._body?.babylon.mesh ?? null, sound._props.useBoundingBox, sound._props.attachmentType)
        })
        return this._body as N
      }

      _removeBody(): void {
        if (this._body) {
          this._getSpatialSounds().forEach(sound => {
            sound.sound.spatial.detach()
          })
          this.clearNodes()
          this._body._release()
          this._body = null
        }
      }

      addNode<N extends B>(Node: new () => N, name: string, transform?: TransformComposition, parentName?: string): ActorNode<B> | undefined {
        if (!this._body) {
          Logger.error(`Cannot add node '${name}' without a body.`, this.getClassName())
          return undefined
        }
        if (this._nodes.has(name)) { Logger.warn(`Trying to add node '${name}' that already exists.`, this.getClassName()); return this._nodes.get(name) }
        if (name === 'boneRoot' || parentName === 'boneRoot') {
          Logger.error('Cannot use \'boneRoot\' as node \'name\' or \'parentName\'.', this.getClassName())
          return undefined
        }
        if (parentName && this._nodes.size === 0) {
          Logger.error('Cannot use \'parentName\' without a previous added node.', this.getClassName())
          return undefined
        }
        const element = this._getNodeElement(Node)
        if (element) {
          if (!this._body.babylon.mesh.skeleton) {
            this._body.babylon.mesh.skeleton = new Skeleton('skeleton', '', this.scene.babylon.scene)
            const boneRoot = new Bone('boneRoot', this._body.babylon.mesh.skeleton, null, Matrix.Identity())
          }
          const boneParentIndex = this._body.babylon.mesh.skeleton.getBoneIndexByName(parentName ?? 'boneRoot')
          const bone = new Bone(name, this._body.babylon.mesh.skeleton, this._body.babylon.mesh.skeleton.bones[boneParentIndex], Matrix.Identity())
          element.babylon.mesh.billboardMode = 0
          element.babylon.mesh.attachToBone(bone, this._body.babylon.mesh)

          const node = { element, bone }
          this._nodes.set(name, node)
          if (this._props.renderingGroupId) {
            element.babylon.mesh.renderingGroupId = this._props.renderingGroupId
            element.babylon.mesh.getChildMeshes().forEach(child => { child.renderingGroupId = this._props.renderingGroupId ?? 0 })
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
        return this._nodes.get(name)
      }

      removeNode(name: string): void {
        const node = this._nodes.get(name)
        if (node) {
          const array = [...node.bone.children]
          array.forEach(bone => {
            this.removeNode(bone.name)
          })
          node.element._release()
          node.bone.dispose()
          this._nodes.delete(name)
          if (this._body && this._nodes.size <= 0) {
            this._body.babylon.mesh.skeleton?.dispose()
            this._body.babylon.mesh.skeleton = null
          }
        }
      }

      clearNodes() {
        this._nodes.forEach(node => {
          node.element._release()
          node.bone.dispose()
        })
        this._nodes.clear()
        if (this._body) {
          this._body.babylon.mesh.skeleton?.dispose()
          this._body.babylon.mesh.skeleton = null
        }
      }

      switchState(state: ActorStateConstructor, setup: any): ActorStateInterface {
        if (process.env.NODE_ENV !== 'production' && !this.scene._availableElements.hasActorState(state)) { Logger.debugError('Denied to set a state non available to the actor. Please check the actor props.', this.getClassName(), state.prototype); return null as any }
        const _state = ActorStatesController.get(state).spawn(this)
        if (this._state) {
          this._state._end()
        }
        this._state = _state
        this._state._start(setup)
        return this._state
      }

      isState(state: ActorStateConstructor): boolean {
        if (this.state) {
          return this.state instanceof state
        } else {
          return false
        }
      }

      playAnimation(animation: FlexId, options?: SpriteAnimationOptions | MeshAnimationOptions, completed?: () => void): void {
        this.body?.playAnimation(animation, options, completed)
      }

      stopAnimation(): void {
        this.body?.stopAnimation()
      }

      playAction(actionConstructor: ActorActionConstructor, setup: any): ActorActionInterface {
        if (process.env.NODE_ENV !== 'production' && !this.scene._availableElements.hasActorAction(actionConstructor)) { Logger.debugError('Trying to play an action non available to the actor. Please check the actor props.', this.getClassName(), actionConstructor.prototype); return null as any }
        let action = this._actions.get(actionConstructor)
        if (!action) {
          action = ActorActionsController.get(actionConstructor).spawn(this)
          this._actions.set(actionConstructor, action)
          action._props.overrides?.forEach(actionOverride => {
            this.stopAction(actionOverride)
          })
          action._start(setup)
        } else {
          action.play()
        }
        return action
      }

      _playActionFromInstance(instance: ActorActionInterface): void {
        for (const [key, value] of this._actions.entries()) {
          if (value === instance) {
            this.playAction(key, {})
            return
          }
        }
      }

      _stopActionFromInstance(instance: ActorActionInterface, forceRemove?: boolean) {
        for (const [key, value] of this._actions.entries()) {
          if (value === instance) {
            this.stopAction(key, forceRemove)
            return
          }
        }
      }

      stopAction(actionConstructor: ActorActionConstructor, forceRemove?: boolean): void {
        const action = this._actions.get(actionConstructor)
        if (action) {
          action._isPlaying = false
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

      getAction<C extends ActorActionConstructor>(actionConstructor: C): InstanceType<C> | undefined {
        return this._actions.get(actionConstructor) as InstanceType<C>
      }

      attachParticle(id: FlexId, particleConstructorOrMethod: ParticleConstructor | ((particle: ParticleInterface, setup: any) => void), setup: any, offset: Vector3, nodeName?: string): ParticleInterface {
        let isMethod = false
        if (!particleConstructorOrMethod.prototype?.constructor) {
          isMethod = true
          const _classDefinition = [...this._metadata.particles].find((value: MetadataParticleDefinition) => particleConstructorOrMethod === value.method as any)?.classDefinition as any
          if (_classDefinition) {
            particleConstructorOrMethod = _classDefinition
          } else {
            Logger.error(`Particle method '${particleConstructorOrMethod.name}' doesn't belong to the actor. Use a decorated method declared within the actor.`, this.getClassName())
            return null as any
          }
        }
        const attachmentSprite = nodeName ? this.getNode(nodeName)?.element : this.body
        if (!attachmentSprite) {
          Logger.error('Cannot attach a particle to an empty body.', this.getClassName(), particleConstructorOrMethod.prototype)
          return null as any
        }

        if (process.env.NODE_ENV !== 'production' && !this.scene._availableElements.hasParticle(particleConstructorOrMethod as ParticleConstructor)) { Logger.debugError('Trying to attach a particle non available to the actor. Please check the actor props.', this.getClassName(), particleConstructorOrMethod.prototype); return null as any }
        const particle = ParticlesController.get(particleConstructorOrMethod).spawn(this.scene, { attachment: attachmentSprite, offset }, !isMethod, setup)

        if (isMethod) {
          // Applies context to 'onInitialize' as caller 'Actor' to preserve the 'this'
          // in case 'initialize' is equivalent to a decorated method of some of those both interfaces.
          particle.onInitialize = particle.onInitialize?.bind(this)
          particle._create(setup)
        }
        if (this._props.renderingGroupId && !particle._props.renderingGroupId && !particle._props.renderOverScene) {
          particle.babylon.particleSystem.renderingGroupId = this._props.renderingGroupId
        }
        this._particles.set(id, particle)
        return particle
      }

      startParticle(id: FlexId): void {
        const particle = this._particles.get(id)
        if (!particle) {
          Logger.error(`Trying to start particle '${id}' that doesn't exist in actor:`, this.getClassName())
          return
        }
        if (this.visibility > 0) {
          particle.start()
        }
      }

      stopParticle(id: FlexId): void {
        const particle = this._particles.get(id)
        if (!particle) {
          Logger.error(`Trying to stop particle '${id}' that doesn't exist in actor:`, this.getClassName())
          return
        }
        particle.stop()
      }

      removeParticle(id: FlexId): void {
        const particle = this._particles.get(id)
        if (!particle) {
          Logger.error(`Trying to remove particle '${id}' that doesn't exist in actor:`, this.getClassName())
          return
        }
        particle._release()
        this._particles.delete(id)
      }

      clearParticles(): void {
        this._particles.forEach((value: ParticleInterface, key: FlexId) => {
          this.removeParticle(key)
        })
      }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this._metadata.notifiers.get(message)
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

      _load(scene: SceneInterface): LoadingProgress {
        return new LoadingProgress().fromNodes([
          ActorStatesController.load(this.props.states, scene),
          ActorActionsController.load(this.props.actions, scene),
          SpritesController.load(this.props.sprites, scene),
          SpritesController.load(this.Instance._metadata.getProps().sprites, scene),
          MeshesController.load(this.props.meshes, scene),
          MeshesController.load(this.Instance._metadata.getProps().meshes, scene),
          ParticlesController.load(this.props.particles, scene),
          ParticlesController.load(this.Instance._metadata.getProps().particles, scene),
          SoundsController.load(this.Instance._metadata.getProps().sounds, null)
          // GUIController.load(this.props.guis, scene)
        ])
      }

      _unload(scene: SceneInterface): void {
        ActorStatesController.unload(this.props.states, scene)
        ActorActionsController.unload(this.props.actions, scene)
        SpritesController.unload(this.props.sprites, scene)
        SpritesController.unload(this.Instance._metadata.getProps().sprites, scene)
        MeshesController.unload(this.props.meshes, scene)
        MeshesController.unload(this.Instance._metadata.getProps().meshes, scene)
        ParticlesController.unload(this.props.particles, scene)
        ParticlesController.unload(this.Instance._metadata.getProps().particles, scene)
        SoundsController.unload(this.Instance._metadata.getProps().sounds, null)
        // GUIController.unload(this.props.guis, scene)
      }

      spawn(scene: SceneInterface): ActorInterface {
        const actor = new _classInterface(scene)
        actor._initialize(this.props)
        return actor
      }

      getClassName(): string {
        return className
      }
    }
    ActorsController.register(_classInterface, new _classCore())
    return _classInterface
  }
}
