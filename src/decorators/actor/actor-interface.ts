import * as BABYLON from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable,
  Notificable
} from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { TimersByContext } from '../../base/interfaces/timers-by-context'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { TransformComposition } from '../../models/transform-composition'
import {
  MeshTransform,
  SpriteTransform
} from '../../types'
import { FlexId } from '../../types/flex-id'
import { MeshAnimation } from '../mesh/mesh-animation'
import { MeshAnimationOptions } from '../mesh/mesh-animation-options'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleConstructor } from '../particle/particle-constructor'
import { ParticleInterface } from '../particle/particle-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from '../sprite/sprite-animation'
import { SpriteAnimationOptions } from '../sprite/sprite-animatrion-options'
import { SpriteInterface } from '../sprite/sprite-interface'
import { ActorActionConstructor } from './actor-action/actor-action-constructor'
import { ActorActionInterface } from './actor-action/actor-action-interface'
import { ActorNode } from './actor-node'
import { ActorProps } from './actor-props'
import { ActorStateConstructor } from './actor-state/actor-state-constructor'
import { ActorStateInterface } from './actor-state/actor-state-interface'

// TODO add animation system, that animates body and nodes depending on what they are
// Actors can't be configurable because they can be spawned from the .babylon scene itself, disallowing to setup their configuration.
export abstract class ActorInterface<B extends SpriteInterface | MeshInterface = any> implements LoopUpdatable, CanvasResizable, Notificable, TimersByContext {
  abstract _metadata: Metadata
  abstract _props: ActorProps
  abstract _loopUpdate: boolean
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract _started: boolean
  abstract _body: B | undefined
  abstract _nodes: Map<string, B>
  abstract _visibility: number
  abstract _state: ActorStateInterface | null
  abstract _actions: Map<ActorActionConstructor, ActorActionInterface>
  abstract _particles: Map<FlexId, ParticleInterface>
  // abstract _guis: Set<GUIInterface>
  // abstract _guisStart(): void
  // abstract _guisRelease(): void
  abstract _initialize(props: ActorProps): void
  abstract _release(): void
  abstract _applyStarted(): void
  abstract _getActionOwner(actionConstructor: ActorActionConstructor): ActorInterface | ActorStateInterface | undefined
  abstract _getNodeElement<N extends B>(Element: new () => N): N
  abstract _playActionFromInstance(instance: ActorActionInterface): void
  abstract _stopActionFromInstance(instance: ActorActionInterface, forceRemove?: boolean): void

  /**
   * User available
   */
  abstract get babylon(): Pick<BabylonAccessor, 'scene'>
  abstract loopUpdate: boolean
  abstract get transform(): B extends SpriteInterface ? SpriteTransform : MeshTransform | null
  abstract get t(): B extends SpriteInterface ? SpriteTransform : MeshTransform | null
  abstract get scene(): SceneInterface
  abstract get body(): B | null
  abstract get state(): ActorStateInterface | null
  abstract set visibility(value: number)
  abstract get visibility(): number
  abstract get enabled(): boolean
  abstract set enabled(value: boolean)
  abstract getClassName(): string
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(timeout: Timeout): void
  abstract clearAllTimeouts(): void
  abstract setBody(Body: new () => B): B
  abstract addNode(Node: new () => B, name: string, transform?: TransformComposition): ActorNode<B> | undefined
  abstract getNode(name: string): ActorNode<B> | undefined
  abstract removeBody(): void
  abstract removeNode(name: string): void
  abstract clearNodes(): void
  abstract switchState(state: ActorStateConstructor, setup: any): ActorStateInterface
  abstract isState(state: ActorStateConstructor): boolean
  abstract playAnimation(animation: FlexId, options?: (B extends SpriteInterface ? SpriteAnimationOptions : MeshAnimationOptions), completed?: () => void): void // TODO system to animate body and nodes all together somehow
  abstract stopAnimation(): void
  // abstract setAnimation(): void // TODO system to animate body and nodes all together somehow
  abstract playAction(action: ActorActionConstructor | ((delta: number) => void), setup: any): ActorActionInterface
  abstract stopAction(action: ActorActionConstructor): void
  abstract playActionGroup(group: FlexId): void
  abstract stopActionGroup(group: FlexId): void
  abstract stopActionAll(): void
  abstract removeAction(actionConstructor: ActorActionConstructor, forceRemove?: boolean): void
  abstract removeActionGroup(group: FlexId, forceRemove?: boolean): void
  abstract removeActionAll(forceRemove?: boolean): void
  abstract getAction<C extends ActorActionConstructor>(actionConstructor: C): InstanceType<C> | undefined
  abstract attachParticle(id: FlexId, Particle: ParticleConstructor | ((particle: ParticleInterface, setup: any) => void), setup: any, offset: BABYLON.Vector3, nodeName?: string): ParticleInterface
  abstract startParticle(id: FlexId): void
  abstract stopParticle(id: FlexId): void
  abstract removeParticle(id: FlexId): void
  abstract clearParticles(): void
  abstract notify(message: FlexId, ...args: any[]): void
  abstract destroy(): void

  /**
   * User defined optional
   */
  onSpawn?(): void
  onStart?(): void
  onDestroy?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
