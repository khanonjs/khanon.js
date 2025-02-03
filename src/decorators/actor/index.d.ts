import * as BABYLON from '@babylonjs/core'

import {
  Rect,
  TransformComposition
} from '../../models'
import {
  FlexId,
  MeshTransform,
  SpriteTransform
} from '../../types'
import {
  MeshConstructor,
  MeshInterface
} from '../mesh'
import {
  ParticleConstructor,
  ParticleInterface
} from '../particle'
import { SceneInterface } from '../scene'
import {
  SpriteConstructor,
  SpriteInterface
} from '../sprite'
import {
  ActorActionConstructor,
  ActorActionInterface
} from './actor-action'
import {
  ActorStateConstructor,
  ActorStateInterface
} from './actor-state'

/**
 * @group Actor
 */

/**
 * Represets a part (node) attached to the body of the actor.
 */
export interface ActorNode<B extends SpriteInterface | MeshInterface> {
  element: B
  bone: BABYLON.Bone
}

/**
 * Actor Interface to be extended from decorated Actors.
 * @param B alludes to what kind of interface this actor will have as Body and Nodes.
 * - To use 2D Sprites set it as 'SpriteInterface'.
 * - To use 3D Meshes set it as 'MeshInterface'.
 */
export declare abstract class ActorInterface<B extends SpriteInterface | MeshInterface> {
  /**
   * Owner scene of this actor.
   */
  get scene(): SceneInterface

  /**
   * Transform of the body.
   */
  // TODO is there a way to return SpriteTransform or MeshTransform from the actor 'this' conditionally based on B generic type?
  // This way we avoid transform accessor and user can access sprite or mesh transform properties directly.
  get transform(): B extends SpriteInterface ? SpriteTransform : MeshTransform

  /**
   * Trasnform alias.
   */
  get t(): B extends SpriteInterface ? SpriteTransform : MeshTransform

  /**
   * Turns on/off the 'onLoopUpdate' callback.
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Body of the actor.
   * This is the main 'Sprite' or 'Mesh. The rest of nodes are attached to this object.
   * 'actor.transform' references to 'actor.body.transform'.
   */
  get body(): B

  /**
   * Gets the current state.
   */
  get state(): ActorStateInterface

  /**
   * 'visibility' of the meshes and sprites of this actor
   */
  set visibility(value: number)
  get visibility(): number

  /**
   * Sets the Body of the Actor.
   * Setting a new Body removes any previously added Node.
   * @param Node
   * @returns
   */
  setBody(Body: new () => B): B

  /**
   * Adds a node attached to the actor's body, or another node in case *parentName* is defined.
   * @param Node
   * @param name
   * @param parentName
   * @returns
   */
  addNode(Node: new () => B, name: string, transform?: TransformComposition, parentName?: string): ActorNode<B> | undefined

  /**
   * Gets a Node by name.
   * @param name
   * @returns
   */
  getNode(name: string): ActorNode<B> | undefined

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
  clearNodes(): void

  /**
   * Sets the visibility of Body and all Nodes.
   * @param value
   */
  setVisible(value: boolean): void

  /**
   * Starts a state.
   * @param state
   */
  switchState<S extends ActorStateConstructor>(state: S, setup: InstanceType<S>['setup']): ActorStateInterface // TODO is it possible to make 'setup' argument optional whether InstanceType<S>['setup'] type is 'any'?

  /**
   * Plays the animation of the body. Equivalent to 'actor.body.playAnimation'.
   * Animations are defined in the Sprite decorator 'props' or manually using 'MeshAnimation' interface.
   * @param animation Animation object or ID of a predefined animation
   * @param loopOverride Overrides the animation loop value in case needed
   * @param completed Completed animation callback
   */
  // TODO system to animate body and nodes all together somehow
  // playAnimation(animation: (B extends SpriteInterface ? SpriteAnimation : MeshAnimation) | FlexId, loopOverride?: boolean, completed?: () => void): void

  /**
   * Stops the animation of the body. Equiuvalent to 'actor.body.stopAnimation'.
   */
  // stopAnimation(): void

  /**
   * Plays an Action. N actions can be played simultaneously.
   * @param action
   */
  playAction<S extends ActorActionConstructor>(action: S | ((delta: number, setup: any) => void), setup: InstanceType<S>['setup']): InstanceType<S> // TODO is it possible to make 'setup' argument optional whether InstanceType<S>['setup'] type is 'any'?

  /**
   * Plays all actions of a group that have been previously stopped.
   * @param group
   */
  playActionGroup(group: FlexId): void

  /**
   * Stops an action. If the actions prop 'preserve' prop is 'false', it will be removed.
   * Actions can be stopped also within the Action itself.
   * @param action
   */
  stopAction(action: ActorActionConstructor | ((delta: number) => void), forceRemove?: boolean): void

  /**
   * Stops all actions of a group. All the actions with 'preserve' prop as 'false' will be removed.
   * @param group
   */
  stopActionGroup(group: FlexId, forceRemove?: boolean): void

  /**
   * Stops all actions. All the actions with 'preserve' prop as 'false' will be removed.
   */
  stopActionAll(forceRemove?: boolean): void

  /**
   * Stops and removes an action.
   */
  removeAction(actionConstructor: ActorActionConstructor): void

  /**
   * Stops and removes all actions of a group.
   * @param group
   */
  removeActionGroup(group: FlexId): void

  /**
   * Stops and removes all actions.
   */
  removeActionAll(): void

  /**
   * Gets an action.
   * @param actionConstructor
   */
  getAction(actionConstructor: ActorActionConstructor): ActorActionInterface | undefined

  /**
   * Attachs a particle to this actor.
   *
   * If nodeName is 'undefined', the particle is attached to the actor's body.
   * @param Particle Particle constructor or an Actor class method.
   * @param id
   * @param offset
   * @param nodeName
   */
  attachParticle(Particle: ParticleConstructor | ((particle: ParticleInterface) => void), id: FlexId, offset: BABYLON.Vector3, nodeName?: string): void

  /**
   * Starts a particle.
   * @param id
   */
  startParticle(id: FlexId): void

  /**
   * Stops a particle.
   * @param id
   */
  stopParticle(id: FlexId): void

  /**
   * Removes a particle.
   * @param id
   */
  removeParticle(id: FlexId): void

  /**
   * Removes all the particles attached to this actor.
   */
  clearParticles(): void

  /**
   * Notifies a message to this actor.
   */
  notify(message: FlexId, ...args: any[]): void

  /**
   * Removes the actor from the scene.
   */
  destroy(): void

  /**
   * Callback invoked after the actor has been spawned on a scene.
   */
  onSpawn?(): void

  /**
   * Callback invoked on actor destroy.
   */
  onDestroy?(): void

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

export type ActorConstructor = new () => ActorInterface<any>

export interface ActorProps {
  /**
   * States to use in this actor.
   */
  states?: ActorStateConstructor[]

  /**
   * Actions to use in this actor.
   */
  actions?: ActorActionConstructor[]

  /**
   * Sprites to use by this actor.
   */
  sprites?: SpriteConstructor[]

  /**
   * Meshes to use by this actor.
   */
  meshes?: MeshConstructor[]

  /**
   * Particles this actor will attach.
   */
  particles?: ParticleConstructor[]

  /**
   * Rendering group Id. This will be applied to all meshes or sprites used by this actor.
   * Use rendering group Id as the rendering layer in ascending order by ID, starting by 0 (default).
   * https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/transparent_rendering#rendering-groups
   */
  renderingGroupId?: number

  /**
   * Initial visibility
   */
  visibility?: number
}

export declare function Actor(props?: ActorProps): any
