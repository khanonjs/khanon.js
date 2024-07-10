import { Observer } from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import {
  ActorsController,
  SpritesController
} from '../../controllers'
import { MeshesController } from '../../controllers/meshes-controller'
import { Rect } from '../../models'
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
import { ActorCore } from './actor-core'
import { ActorInterface } from './actor-interface'
import { ActorMetadata } from './actor-metadata'
import { ActorProps } from './actor-props'

type B = SpriteInterface | MeshInterface

export function Actor(props: ActorProps = {}): any {
  return function <T extends { new (...args: any[]): ActorInterface }>(constructor: T & ActorInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements ActorInterface {
      constructor(readonly scene: SceneType) {
        super()
        this.metadata.sprites.forEach(definition => {
          this[definition.propertyName] = definition.classDefinition
        })
      }

      initialize(props: ActorProps) {
        this.props = props
        invokeCallback(this.onSpawn, this, this.scene)
      }

      props: ActorProps
      metadata: ActorMetadata = Reflect.getMetadata('metadata', this) ?? new ActorMetadata()
      transform: SpriteTransform | MeshTransform
      loopUpdate$: Observer<number>
      canvasResize$: Observer<Rect>
      _body?: B
      nodes?: Map<string, B> = new Map<string, B>()

      onSpawn?(): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(size: Rect): void

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }

      get body(): SpriteInterface | MeshInterface { return this._body }

      release() {
        removeLoopUpdate(this) // 8a8f esto aquí?
        removeCanvasResize(this)
      }

      setBody<B>(Body: new () => B): B {
        this.clearNodes()
        if (new Body() instanceof SpriteInterface) {
          if (!this.metadata.sprites.find(_definition => _definition.classDefinition === Body) && !this.props.sprites?.find(_sprite => _sprite === Body)) { Logger.debugError('Trying to use a sprite non available to the actor. Please check the actor props.', this.constructor.prototype, Body.prototype); return }
          this._body = SpritesController.get(Body).spawn(this.scene) as any
        } else {
          if (!this.props.meshes?.find(_mesh => _mesh === Body)) { Logger.debugError('Trying to use a mesh non available to the actor. Please check the actor props.', this.constructor.prototype, Body.prototype); return }
          this._body = MeshesController.get(Body).spawn(this.scene) as any
        }
        this.transform = this._body.transform
        attachLoopUpdate(this) // 8a8f esto aquí?
        attachCanvasResize(this)
        return this._body as unknown as B
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

      setVisible(value: boolean) {
        // TODO
      }

      private clearNodes?() {
        this.nodes.forEach(node => {
          node.release()
        })
        this.nodes.clear()
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
