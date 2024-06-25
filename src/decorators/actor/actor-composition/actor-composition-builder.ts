import { DisplayObject } from '../../../base/classes/display-object'
import {
  MeshConstructor,
  SpriteConstructor
} from '../../../constructors'
import { SpritesController } from '../../../controllers'
import { MeshesController } from '../../../controllers/meshes-controller'
import { Logger } from '../../../modules'
import { MeshInterface } from '../../mesh/mesh-interface'
import { SceneType } from '../../scene/scene-type'
import { SpriteInterface } from '../../sprite/sprite-interface'
import { ActorInterface } from '../actor-interface'

export class ActorCompositionBuilder {
  fakeId = 0
  nodes: Map<string, DisplayObject> = new Map<string, DisplayObject>()
  body: SpriteInterface | MeshInterface

  constructor(private readonly id: string, private readonly scene: SceneType, private readonly actor: ActorInterface) {}

  setBody<N extends SpriteConstructor | MeshConstructor>(Node: N): N extends SpriteConstructor ? SpriteInterface : MeshInterface {
    if (new Node() instanceof SpriteInterface) {
      this.body = SpritesController.get(Node).spawn(this.scene)
    } else {
      this.body = MeshesController.get(Node).spawn(this.scene)
    }
    this.actor.body = this.body
    return this.body as any
  }

  addNode<N extends SpriteConstructor | MeshConstructor>(Node: N, name?: string): N {
    // 8a8f
    // if (!name) {
    //   name = (++this.fakeId).toString()
    // }
    // if (this.nodes.get(name)) { Logger.debugError(`ActorCompositionDefinition - Adding a node with name already defined '${name}'`); return }
    // check new node is compatible with body
    return null
  }

  release(): void {
    this.body?.release()
    this.nodes.forEach(node => node.release())
  }
}
