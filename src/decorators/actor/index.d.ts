import { ActorActionConstructor } from '../../constructors/actor-action-constructor'
import { ActorStateConstructor } from '../../constructors/actor-state-constructor'
import { Rect } from '../../models'
import {
  MeshTransform,
  SpriteTransform
} from '../../types'
import { MeshInterface } from '../mesh'
import { SceneInterface } from '../scene'
import { SpriteInterface } from '../sprite'
import { ActorActionOptions } from './actor-action'
import { ActorProps } from './actor-props'
import {
  ActorStateInterface,
  ActorStateOptions
} from './actor-state'

export { ActorProps } from './'
export declare function Actor(props?: ActorProps): any
/**
 * Actor Interface to be extended from decorated Actors.
 * @param B alludes to what kind of interface this actor will have as Body and Nodes.
 * To use 2D Sprites set it as 'SpriteInterface'.
 * To use 3D Messhes set it as 'MeshInterface'.
 */
export declare abstract class ActorInterface<B extends SpriteInterface | MeshInterface> {
  /**
   * Transform of the body.
   */
  get transform(): B extends SpriteInterface ? SpriteTransform : MeshTransform

  /**
   * Turns On/Off 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Body of this actor.
   * This is the main 'Sprite' or 'Mesh. The rest of nodes are attached to this object.
   * 'actor.transform' references to 'actor.body.transform'.
   */
  get body(): B

  /**
   * Gets the current state.
   */
  get state(): ActorStateInterface

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
   * Removes the body.
   */
  removeBody(): void

  /**
   * Removes a node.
   * @param name
   */
  removeNode(name: string): void

  /**
   * Clear all nodes of this actor.
   */
  clearNodes(includeBody?: boolean): void

  /**
   * Sets the visibility of Body and all Nodes.
   * @param value
   */
  setVisible(value: boolean)

  /**
   * Starts a state.
   * @param state
   */
  startState<S extends ActorStateConstructor>(state: S): ActorStateOptions<InstanceType<S>['setup']>

  /**
   * Plays an Action. N actions can be played simultaneously.
   * @param action
   */
  playAction<S extends ActorActionConstructor>(action: ActorActionConstructor): ActorActionOptions<InstanceType<S>['setup']>

  /**
   * Stops an action. Actions can be stopped also within the Action itself.
   * @param action
   */
  stopAction(action: ActorActionConstructor): void

  /**
   * Callback invoked after the actor has been spawned on a scene.
   */
  onSpawn?(scene: SceneInterface): void

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
