import {
  MeshConstructor,
  SpriteConstructor
} from '../../constructors'
import { SpritesController } from '../../controllers'
import { MeshesController } from '../../controllers/meshes-controller'
import {
  attachCanvasResize,
  attachLoopUpdate
} from '../../utils/utils'
import { MeshInterface } from '../mesh/mesh-interface'
import { SpriteInterface } from '../sprite/sprite-interface'
import { ActorInterface } from './actor-interface'

export class ActorComposer<B extends SpriteInterface | MeshInterface = any> {
  private _body?: B
  private nodes?: Map<string, B> = new Map<string, B>()
  private readonly actor?: ActorInterface

  constructor(actor: ActorInterface) {
    this.actor = actor
  }

  get body(): B { return this._body }

  /**
   * Sets the Body of the Actor.
   * Setting a new Body removes any previously added Node.
   * @param Node
   * @returns
   */
  setBody<N extends SpriteInterface | MeshInterface>(Node: new () => N): N {
    this.nodes.forEach(node => {
      node.release()
    })
    this.nodes.clear()
    if (new Node() instanceof SpriteInterface) {
      this._body = SpritesController.get(Node).spawn(this.actor.scene) as any
    } else {
      this._body = MeshesController.get(Node).spawn(this.actor.scene) as any
    }
    this.actor.transform = this._body.transform
    attachLoopUpdate(this.actor) // 8a8f esto aquí?
    attachCanvasResize(this.actor)
    return this._body as unknown as N
  }

  /**
   * Adds a Node hooked to the actor's body.
   * @param Node
   * @param name
   * @returns
   */
  addNode<N extends SpriteConstructor | MeshConstructor>(Node: N, name: string): B {
    // 8a8f
    // if (!name) {
    //   name = (++this.fakeId).toString()
    // }
    // if (this.nodes.get(name)) { Logger.debugError(`ActorCompositionDefinition - Adding a node with name already defined '${name}'`); return }
    return null
  }

  /**
   * Gets a Node by name.
   * @param name
   * @returns
   */
  getNode(name: string): B {
    // 8a8f
    return null
  }

  setVisible(value: boolean) {
    // 8a8f
  }
}
