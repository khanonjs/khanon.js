import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import { ActorActionConstructor } from '../../constructors/actor-action-constructor'
import { ActorStateConstructor } from '../../constructors/actor-state-constructor'
import {
  ActorActionsController,
  ActorsController,
  ActorStatesController,
  MeshesController,
  SpritesController
} from '../../controllers'
import { Rect } from '../../models/rect'
import { Logger } from '../../modules/logger'
import {
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
import { MeshInterface } from '../mesh/mesh-interface'
import { SceneType } from '../scene/scene-type'
import { SpriteInterface } from '../sprite/sprite-interface'
import { ActorActionInterface } from './actor-action/actor-action-interface'
import { ActorActionOptions } from './actor-action/actor-action-options'
import { ActorCore } from './actor-core'
import { ActorInterface } from './actor-interface'
import { ActorMetadata } from './actor-metadata'
import { ActorProps } from './actor-props'
import { ActorStateInterface } from './actor-state/actor-state-interface'
import { ActorStateOptions } from './actor-state/actor-state-options'

type B = SpriteInterface | MeshInterface

export function Actor(props: ActorProps = {}): any {
  return function <T extends { new (...args: any[]): ActorInterface }>(constructor: T & ActorInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements ActorInterface {
      constructor(readonly scene: SceneType) {
        super()
        this.metadata.applyProps(this)
      }

      initialize(props: ActorProps) {
        this.props = props
        invokeCallback(this.onSpawn, this)
      }

      props: ActorProps
      metadata: ActorMetadata = Reflect.getMetadata('metadata', this) ?? new ActorMetadata()
      transform: SpriteTransform | MeshTransform
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>
      _body?: B
      nodes?: Map<string, B> = new Map<string, B>()
      _state: ActorStateInterface
      actions: Map<ActorActionConstructor, ActorActionInterface> = new Map<ActorActionConstructor, ActorActionInterface>()

      onSpawn?(): void
      onDestroy?(): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(size: Rect): void

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }
      get body(): SpriteInterface | MeshInterface { return this._body }
      get state(): ActorStateInterface { return this._state }

      release() {
        // TODO particles
        invokeCallback(this.onDestroy, this)
        this.stopActionAll()
        this.clearNodes()
        removeLoopUpdate(this)
        removeCanvasResize(this)
      }

      setBody<B>(Body: new () => B): B {
        if (new Body() instanceof SpriteInterface) { // TODO is there a better way to do this avoiding the 'new'?
          if (!this.metadata.sprites.find(_definition => _definition.classDefinition === Body) && !this.props.sprites?.find(_sprite => _sprite === Body)) { Logger.debugError('Trying to use a sprite non available to the actor. Please check the actor props.', this.constructor.prototype, Body.prototype); return }
          this._body = SpritesController.get(Body).spawn(this.scene) as any
        } else {
          if (!this.metadata.meshes.find(_definition => _definition.classDefinition === Body) && !this.props.meshes?.find(_mesh => _mesh === Body)) { Logger.debugError('Trying to use a mesh non available to the actor. Please check the actor props.', this.constructor.prototype, Body.prototype); return }
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

      addNode<B>(Node: B, name: string): B {
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

      setVisible(value: boolean) {
        // TODO
      }

      startState(state: ActorStateConstructor): ActorStateOptions {
        if (!this.props.states?.find(_state => _state === state)) { Logger.debugError('Trying to set a state non available to the actor. Please check the actor props.', _classInterface.prototype, state.prototype); return }
        const _state = ActorStatesController.get(state).spawn(this)
        if (this._state) {
          this._state.end()
        }
        this._state = _state
        this._state.start()
        return new ActorStateOptions(this._state)
      }

      playAction(actionConstructor: ActorActionConstructor): ActorActionOptions<any> {
        if (!this.props.actions?.find(_action => _action === actionConstructor) && !this.metadata.getProps().actions?.find(_action => _action === actionConstructor) && !this._state?.metadata.getProps().actions?.find(_action => _action === actionConstructor)) { Logger.debugError('Trying to play an action non available to the actor. Please check the actor props.', _classInterface.prototype, actionConstructor.prototype); return }
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
          action.start()
        }
        return new ActorActionOptions(action)
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

      clearNodes(includeBody = true) {
        this.nodes.forEach(node => {
          node.release()
        })
        this.nodes.clear()
        if (includeBody) {
          this.removeBody()
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

      load(scene: SceneType): LoadingProgress {
        const progress = new LoadingProgress().complete()
        SpritesController.load(this.props.sprites, scene)
        SpritesController.load(this.Instance.metadata.getProps().sprites, scene)
        MeshesController.load(this.props.meshes, scene)
        MeshesController.load(this.Instance.metadata.getProps().meshes, scene)
        return progress
      }

      unload(): void {
        // TODO
      }

      spawn(scene: SceneType): ActorInterface {
        const actor = new _classInterface(scene)
        actor.initialize(this.props)
        return actor
      }
    }
    ActorsController.register(new _classCore())
    return _classInterface
  }
}
