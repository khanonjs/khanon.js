import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../../base'
import { Core } from '../../../base/core/core'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import {
  ActorStatesController,
  MeshesController,
  ParticlesController,
  SpritesController
} from '../../../controllers'
import { BabylonAccessor } from '../../../models/babylon-accessor'
import { Rect } from '../../../models/rect'
import { Timeout } from '../../../models/timeout'
import { Logger } from '../../../modules/logger'
import { FlexId } from '../../../types/flex-id'
import {
  attachCanvasResize,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../../utils/utils'
import { SceneInterface } from '../../scene/scene-interface'
import { ActorInterface } from '../actor-interface'
import { ActorStateConstructor } from './actor-state-constructor'
import { ActorStateCore } from './actor-state-core'
import { ActorStateInterface } from './actor-state-interface'
import { ActorStateProps } from './actor-state-props'

export function ActorState(props: ActorStateProps = {}): any {
  return function <T extends { new (...args: any[]): ActorStateInterface }>(constructor: T & ActorStateInterface, context: ClassDecoratorContext) {
    const className = constructor.name
    const _classInterface = class extends constructor implements ActorStateInterface {
      constructor(readonly actor: ActorInterface, props: ActorStateProps) {
        super()
        if (this.actor) {
          this._props = props
          this.actor = actor
          this.scene = this.actor.scene
          this.babylon.scene = this.actor.babylon.scene
          this._metadata.applyProps(this)
        }
      }

      getClassName(): string { return className }

      setTimeout(func: () => void, ms: number): Timeout { return Core.setTimeout(func, ms, this) }
      setInterval(func: () => void, ms: number): Timeout { return Core.setInterval(func, ms, this) }
      clearTimeout(timeout: Timeout): void { Core.clearTimeout(timeout) }
      clearInterval(interval: Timeout): void { Core.clearInterval(interval) }
      clearAllTimeouts(): void { Core.clearAllTimeoutsByContext(this) }

      _props: ActorStateProps
      babylon: Pick<BabylonAccessor, 'scene'> = { scene: null as any }
      _metadata: Metadata = Reflect.getMetadata('metadata', this) ?? new Metadata()
      _loopUpdate = true
      _loopUpdate$: BABYLON.Observer<number>
      _canvasResize$: BABYLON.Observer<Rect>
      scene: SceneInterface
      setup: any

      set loopUpdate(value: boolean) {
        this._loopUpdate = value
        switchLoopUpdate(this._loopUpdate, this)
      }

      get loopUpdate(): boolean { return this._loopUpdate }

      switchState(state: ActorStateConstructor, setup: any): ActorStateInterface {
        return this.actor.switchState(state, setup)
      }

      _start(setup: any): void {
        Logger.debug('ActorState start', this.getClassName(), this.actor.getClassName())
        this.setup = setup
        invokeCallback(this.onStart, this)
        switchLoopUpdate(this._loopUpdate, this)
        attachCanvasResize(this)
      }

      _end(): void {
        this.clearAllTimeouts()
        removeLoopUpdate(this)
        removeCanvasResize(this)
        invokeCallback(this.onEnd, this)
      }

      notify(message: FlexId, ...args: any[]): void {
        const definition = this._metadata.notifiers.get(message)
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

      _load(scene: SceneInterface): LoadingProgress {
        return new LoadingProgress().fromNodes([
          SpritesController.load(this.props.sprites, scene),
          SpritesController.load(this.Instance._metadata.getProps().sprites, scene),
          MeshesController.load(this.props.meshes, scene),
          MeshesController.load(this.Instance._metadata.getProps().meshes, scene),
          ParticlesController.load(this.props.particles, scene),
          ParticlesController.load(this.Instance._metadata?.getProps().particles, scene)
        ])
      }

      _unload(scene: SceneInterface): void {
        SpritesController.unload(this.props.sprites, scene)
        SpritesController.unload(this.Instance._metadata.getProps().sprites, scene)
        MeshesController.unload(this.props.meshes, scene)
        MeshesController.unload(this.Instance._metadata.getProps().meshes, scene)
        ParticlesController.unload(this.props.particles, scene)
        ParticlesController.unload(this.Instance._metadata?.getProps().particles, scene)
      }

      getClassName(): string {
        return className
      }
    }
    ActorStatesController.register(new _classCore())
    return _classInterface
  }
}
