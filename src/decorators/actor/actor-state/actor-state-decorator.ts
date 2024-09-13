import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import {
  ActorStatesController,
  MeshesController,
  SpritesController
} from '../../../controllers'
import { Rect } from '../../../models/rect'
import { Logger } from '../../../modules/logger'
import { FlexId } from '../../../types/flex-id'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../../utils/utils'
import { SceneInterface } from '../../scene/scene-interface'
import { ActorInterface } from '../actor-interface'
import { ActorStateCore } from './actor-state-core'
import { ActorStateInterface } from './actor-state-interface'
import { ActorStateProps } from './actor-state-props'

export function ActorState(props: ActorStateProps = {}): any {
  return function <T extends { new (...args: any[]): ActorStateInterface }>(constructor: T & ActorStateInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements ActorStateInterface {
      constructor(actor: ActorInterface, props: ActorStateProps) {
        super()
        if (actor) {
          this.props = props
          this.actor = actor
          this.scene = this.actor.scene
        }
        this.metadata.applyProps(this)
      }

      props: ActorStateProps
      actor: ActorInterface
      metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>
      scene: SceneInterface
      setup: any

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }

      start(): void {
        Logger.debug('ActorState start', _classInterface.prototype, this.actor.constructor.prototype)
        invokeCallback(this.onStart, this)
        attachLoopUpdate(this)
        attachCanvasResize(this)
      }

      end(): void {
        removeLoopUpdate(this)
        removeCanvasResize(this)
        invokeCallback(this.onEnd, this)
      }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this.metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }
    }
    const _classCore = class implements ActorStateCore {
      props = props
      Instance: ActorStateInterface = new _classInterface(null as any, null as any)

      spawn(actor: ActorInterface): ActorStateInterface {
        const state = new _classInterface(actor, this.props)
        return state
      }

      load(scene: SceneInterface): LoadingProgress {
        const progress = new LoadingProgress().complete()
        SpritesController.load(this.props.sprites, scene)
        SpritesController.load(this.Instance.metadata.getProps().sprites, scene)
        MeshesController.load(this.props.meshes, scene)
        MeshesController.load(this.Instance.metadata.getProps().meshes, scene)
        return progress
      }

      unload(scene: SceneInterface): void {
        SpritesController.unload(this.props.sprites, scene)
        SpritesController.unload(this.Instance.metadata.getProps().sprites, scene)
        MeshesController.unload(this.props.meshes, scene)
        MeshesController.unload(this.Instance.metadata.getProps().meshes, scene)
      }
    }
    ActorStatesController.register(new _classCore())
    return _classInterface
  }
}
