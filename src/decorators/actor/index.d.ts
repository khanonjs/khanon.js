import * as BABYLON from '@babylonjs/core'

import {
  BabylonAccessor,
  Rect,
  Timeout,
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
import { ParticleConstructor } from '../particle'
import { SceneInterface } from '../scene'
import {
  SpriteConstructor,
  SpriteInterface
} from '../sprite'
import { ActorActionConstructor } from './actor-action'
import {
  ActorStateConstructor,
  ActorStateInterface
} from './actor-state'

/**
 * @group Actor
 */

/**
 * Node attached to the body of the actor.
 */
export interface ActorNode<B extends SpriteInterface | MeshInterface> {
  element: B
  bone: BABYLON.Bone
}

/**
 * ActorInterface extend from decorated Actors.
 * @param B (Required) Constructor type of Body and Nodes. Set it as *SpriteInterface* to use 2D sprites. Set it as *MeshInterface* To use 3D meshes.
 */
export declare abstract class ActorInterface<B extends SpriteInterface | MeshInterface> {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'scene'>

  /**
   * Owner scene of this actor.
   */
  get scene(): SceneInterface

  /**
   * Gets the current state.
   */
  get state(): ActorStateInterface | null

  /**
   * Transform of the body.
   */
  // IMPROVE is there a way to return SpriteTransform or MeshTransform from the actor 'this' conditionally based on B generic type?
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
   * 'visibility' of the meshes and sprites of this actor
   */
  set visibility(value: number)
  get visibility(): number

  /**
   * Sets or gets the enabled status of the actor. If disabled, the actor wont be rendered, and all its actions and states will be paused.
   */
  set enabled(value: boolean)
  get enabled(): boolean

  /**
   * Returns the name of the class.
   */
  getClassName(): string

  /**
   * Sets a timeout.
   * This interval relies on the app loopUpdate and it will be triggered on correct frame.
   * It will be removed on context remove.
   * @param func Callback
   * @param ms Milliseconds
   */
  setTimeout(func: () => void, ms: number): Timeout

  /**
   * Sets an interval.
   * This interval relies on the app loopUpdate and it will be triggered on correct frame.
   * It will be removed on context remove.
   * @param func Callback
   * @param ms Milliseconds
   */
  setInterval(func: () => void, ms: number): Timeout

  /**
   * Clears a timeout in this context.
   * @param timeout
   */
  clearTimeout(timeout: Timeout): void

  /**
   * Clears an interval in this context.
   * @param timeout
   */
  clearInterval(timeout: Timeout): void

  /**
   * Clear all timeouts and intervals in this context.
   */
  clearAllTimeouts(): void

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
   * Removes a node.
   * @param name
   */
  removeNode(name: string): void

  /**
   * Clear all nodes of this actor.
   */
  clearNodes(): void

  /**
   * Starts a state.
   * @param state
   */
  switchState<C extends ActorStateConstructor>(state: C, setup: InstanceType<C>['setup']): InstanceType<C> // IMPROVE is it possible to make 'setup' argument optional whether InstanceType<S>['setup'] type is 'any'?

  /**
   * Returns *true* if the actor state coincides with  *state*.
   * @param state
   */
  isState(state: ActorStateConstructor): boolean

  /**
   * Plays the animation of the body. Equivalent to 'actor.body.playAnimation'.
   * Animations are defined in the Sprite decorator 'props' or manually using 'MeshAnimation' interface.
   * @param animation Animation object or ID of a predefined animation
   * @param loopOverride Overrides the animation loop value in case needed
   * @param completed Completed animation callback
   */
  // KJS-25 system to animate body and nodes all together somehow
  // playAnimation(animation: (B extends SpriteInterface ? SpriteAnimation : MeshAnimation) | FlexId, loopOverride?: boolean, completed?: () => void): void

  /**
   * Stops the animation of the body. Equiuvalent to 'actor.body.stopAnimation'.
   */
  // stopAnimation(): void

  /**
   * Plays an Action. N actions can be played simultaneously.
   * @param action
   */
  playAction<C extends ActorActionConstructor>(action: C, setup: InstanceType<C>['setup']): InstanceType<C> // IMPROVE is it possible to make 'setup' argument optional whether InstanceType<S>['setup'] type is 'any'?

  /**
   * Plays all actions of a group that have been previously stopped.
   * @param group
   */
  playActionGroup(group: FlexId): void

  /**
   * Stops an action. If the actions prop 'preserve' prop is *false*, it will be removed.
   * Actions can be stopped also within the Action itself.
   * @param action
   */
  stopAction(action: ActorActionConstructor | ((delta: number) => void), forceRemove?: boolean): void

  /**
   * Stops all actions of a group. All the actions with 'preserve' prop as *false* will be removed.
   * @param group
   */
  stopActionGroup(group: FlexId, forceRemove?: boolean): void

  /**
   * Stops all actions. All the actions with 'preserve' prop as *false* will be removed.
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
  getAction<C extends ActorActionConstructor>(actionConstructor: C): InstanceType<C> | undefined

  /**
   * Attachs a particle to this actor.
   *
   * If nodeName is 'undefined', the particle is attached to the actor's body.
   * @param id
   * @param Particle Particle constructor or an Actor class method.
   * @param setup Setup object of the particle defined in the particle generic S
   * @param offset
   * @param nodeName
   */
  attachParticle<P extends ParticleConstructor>(id: FlexId, Particle: P | ((particle: InstanceType<P>, setup?: any) => void), setup: InstanceType<P>['setup'], offset: BABYLON.Vector3, nodeName?: string): InstanceType<P>

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
   * Callback invoked after the scene *onStart* and the actor is enabled by the first time.
   */
  onStart?(): void

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
   * (Experimental) Spawns the actor by reference Id. The reference Id is case sensitive. Use this property to spawn 3D actors.
   * In case the scene is loaded from a '.babylon' file, the actor is spawned replacing every mesh whose Id starts by this reference Id (E.g. 'RefId', 'RefId.001', 'RefId.002', etc).
   * If 'setBody' is not used in the actor's 'onSpawn', the actor will be spawned using the '.babylon' scene mesh as body.
   * If 'setBody' is used in the actor's 'onSpawn', the actor will be spawned replacing the mesh in the '.babylon' scene. The scene mesh will be disposed and the actor will use its own defined body in 'onSpawn' callback.
   * See https://khanonjs.com/api-docs/interfaces/decorators_scene.SceneProps.html#url to know how to load a scene from a '.banylon' file.
   * This feature is EXPERIMENTAL. There are some issues with Blender exported mesh positions, and it has not been tested with 3DS Max or Maya exporters.
   */
  spawnByReferenceId?: string

  /**
   * Rendering group Id. This will be applied to all meshes or sprites used by this actor.
   * Use rendering group Id as the rendering layer in ascending order by ID, starting by 0 (default).
   * https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/transparent_rendering#rendering-groups
   */
  renderingGroupId?: number

  /**
   * *true* by default, sets the initial enabled state.
   */
  enabled?: boolean
}

export declare function Actor(props?: ActorProps): any
