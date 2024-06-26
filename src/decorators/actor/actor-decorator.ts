import { LoadingProgress } from '../../base'
import { DisplayObject } from '../../base/classes/display-object'
import {
  MeshConstructor,
  SpriteConstructor
} from '../../constructors'
import {
  ActorsController,
  SpritesController
} from '../../controllers'
import { MeshesController } from '../../controllers/meshes-controller'
import { Logger } from '../../modules'
import {
  MeshTransform,
  SpriteTransform
} from '../../types'
import {
  invokeCallback,
  removeArrayDuplicitiesInObject
} from '../../utils/utils'
import { MeshInterface } from '../mesh/mesh-interface'
import { SceneType } from '../scene/scene-type'
import { SpriteInterface } from '../sprite/sprite-interface'
import { ActorCore } from './actor-core'
import { ActorInterface } from './actor-interface'
import { ActorMetadata } from './actor-metadata'
import { ActorProps } from './actor-props'

export function Actor(props: ActorProps): any {
  return function <T extends { new (...args: any[]): ActorInterface }>(constructor: T & ActorInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements ActorInterface {
      metadata: ActorMetadata = Reflect.getMetadata('metadata', this)
      body: SpriteInterface | MeshInterface
      transform: SpriteTransform | MeshTransform

      constructor(private readonly scene: SceneType) {
        super()
      }

      onSpawn?(): void

      useComposition(id: string): void {
        if (!this.metadata.compositions.get(id)) { Logger.debugError(`Actor - Actor composition not found: ${id}`, this) }
        this.metadata.compositions.get(id).apply(this, [this.scene])
      }

      setBody<N extends SpriteConstructor | MeshConstructor>(Node: N): any {
        if (new Node() instanceof SpriteInterface) {
          this.body = SpritesController.get(Node).spawn(this.scene)
        } else {
          this.body = MeshesController.get(Node).spawn(this.scene)
        }
        return this.body as any
      }

      addNode<N extends SpriteConstructor | MeshConstructor>(Node: N, name?: string): any {
        // 8a8f
        // if (!name) {
        //   name = (++this.fakeId).toString()
        // }
        // if (this.nodes.get(name)) { Logger.debugError(`ActorCompositionDefinition - Adding a node with name already defined '${name}'`); return }
        return null
      }
    }
    const _classCore = class implements ActorCore {
      props = removeArrayDuplicitiesInObject(props)
      Instance: ActorInterface = new _classInterface(null)
      loaded = false

      load(scene: SceneType): LoadingProgress {
        const progress = new LoadingProgress().complete()
        // SpritesController.load(this.props.sprites, scene)
        // 8a8f Load  the rest of props
        return progress
      }

      unload(): void {

      }

      compose() {
        return []
      }

      spawn(scene: SceneType): ActorInterface {
        const actor = new _classInterface(scene)
        invokeCallback(actor.onSpawn, actor, scene)
        return actor
      }
    }
    ActorsController.register(new _classCore())
    return _classInterface
  }
}
