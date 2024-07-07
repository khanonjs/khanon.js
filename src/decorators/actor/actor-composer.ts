import { SpritesController } from '../../controllers'
import { MeshesController } from '../../controllers/meshes-controller'
import { Logger } from '../../modules/logger'
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
   * @param Body
   * @returns
   */
  setBody<B>(Body: new () => B): B {
    this.clearNodes()
    if (new Body() instanceof SpriteInterface) {
      if (!this.actor.metadata.sprites.find(_definition => _definition.classDefinition === Body) && !this.actor.props.sprites?.find(_sprite => _sprite === Body)) { Logger.debugError('Trying to use a sprite non available to the actor. Please check the actor props.', this.actor.constructor.prototype, Body.prototype); return }
      this._body = SpritesController.get(Body).spawn(this.actor.scene) as any
    } else {
      if (!this.actor.props.meshes?.find(_mesh => _mesh === Body)) { Logger.debugError('Trying to use a mesh non available to the actor. Please check the actor props.', this.actor.constructor.prototype, Body.prototype); return }
      this._body = MeshesController.get(Body).spawn(this.actor.scene) as any
    }
    this.actor.transform = this._body.transform
    attachLoopUpdate(this.actor) // 8a8f esto aquí?
    attachCanvasResize(this.actor)
    return this._body as unknown as B
  }

  /**
   * Adds a Node hooked to the actor's body.
   * @param Node
   * @param name
   * @returns
   */
  addNode<B>(Node: B, name: string): B {
    // TODO
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
