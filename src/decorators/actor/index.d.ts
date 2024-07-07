import KJS from '../../kjs'
import { Rect } from '../../models'
import {
  MeshTransform,
  SpriteTransform
} from '../../types'
import { MeshInterface } from '../mesh'
import { SpriteInterface } from '../sprite'
import { ActorProps } from './actor-props'

export { ActorProps } from './'
export declare function Actor(props?: ActorProps): any
export declare class ActorComposer<B extends SpriteInterface | MeshInterface> {
  /**
   * Body of this actor.
   * This is the main 'Sprite' or 'Mesh. The rest of nodes are attached to this object.
   * 'actor.transform' references to 'actor.body.transform'.
   */
  get body(): B

  /**
   * Sets the Body of the Actor.
   * Setting a new Body removes any previously added Node.
   * @param Node
   * @returns
   */
  setBody<B>(Body: new () => B): B

  /**
   * Adds a Node hooked to the actor's body.
   * @param Node
   * @param name
   * @returns
   */
  addNode<B>(Node: B, name: string): B

  /**
   * Gets a Node by name.
   * @param name
   * @returns
   */
  getNode(name: string): B

  /**
   * Sets the visibility of Body and all Nodes
   * @param value
   */
  setVisible(value: boolean)
}

/**
 * Actor Interface to be extended from decorated Actors.
 * The generic 'B' alludes to what kind of interface this actor will have as Body and Nodes (if it is composed by Sprites or Meshes).
 */
export declare abstract class ActorInterface<B extends SpriteInterface | MeshInterface> {
  /**
   * Transform of the body.
   */
  get transform(): B extends SpriteInterface ? SpriteTransform : MeshTransform

  /**
   * Gets the ActorComposer class.
   * This class is used to compose the actor shape, composed by a main body and nodes hooked to it.
   */
  get composer(): ActorComposer<B>

  /**
   * Turns ON/OFF 'onLoopUpdate' callback
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Callback invoked after the actor has been spawned on a scene
   */
  onSpawn?(scene: KJS.Scene): void

  /**
   * Callback invoked on loop update.
   * @param delta Time differential since last frame.
   */
  onLoopUpdate?(delta: number): void

  /**
   * Callback invoked on canvas resize.
   * @param canvasSize Canvas Rect.
   */
  onCanvasResize?(size: Rect): void
}
