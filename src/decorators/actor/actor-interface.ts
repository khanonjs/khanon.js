import * as BABYLON from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable,
  Notificable
} from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { Rect } from '../../models/rect'
import { FlexId } from '../../types/flex-id'
import { MeshTransform } from '../../types/mesh-transform'
import { SpriteTransform } from '../../types/sprite-transform'
import { MeshAnimation } from '../mesh/mesh-animation'
import { MeshInterface } from '../mesh/mesh-interface'
import { ParticleConstructor } from '../particle/particle-constructor'
import { ParticleInterface } from '../particle/particle-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from '../sprite/sprite-animation'
import { SpriteInterface } from '../sprite/sprite-interface'
import { ActorActionConstructor } from './actor-action/actor-action-constructor'
import { ActorActionInterface } from './actor-action/actor-action-interface'
import { ActorProps } from './actor-props'
import { ActorStateConstructor } from './actor-state/actor-state-constructor'
import { ActorStateInterface } from './actor-state/actor-state-interface'

// TODO add animation system, that animates body and nodes depending on what they are
export abstract class ActorInterface<B extends SpriteInterface | MeshInterface = any> implements LoopUpdatable, CanvasResizable, Notificable {
  abstract metadata: Metadata
  abstract props: ActorProps
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract _body: B | undefined
  abstract nodes: Map<string, B>
  abstract _state: ActorStateInterface | null
  abstract actions: Map<ActorActionConstructor, ActorActionInterface>
  abstract particles: Map<FlexId, ParticleInterface>
  abstract initialize(props: ActorProps): void
  abstract release(): void
  abstract playActionFromInstance(instance: ActorActionInterface): void
  abstract stopActionFromInstance(instance: ActorActionInterface, forceRemove?: boolean): void

  /**
   * User available
   */
  abstract loopUpdate: boolean
  abstract get transform(): (B extends SpriteInterface ? SpriteTransform : MeshTransform) | null
  abstract get t(): (B extends SpriteInterface ? SpriteTransform : MeshTransform) | null
  abstract get scene(): SceneInterface
  abstract get body(): B | null
  abstract get state(): ActorStateInterface | null
  abstract setBody(Body: new () => B): B
  abstract addNode(Node: B, name: string, offset: BABYLON.Vector3 | BABYLON.Matrix): B
  abstract getNode(name: string): B
  abstract removeBody(): void
  abstract removeNode(name: string): void
  abstract clearNodes(includeBody: boolean): void
  abstract setVisible(value: boolean): void
  abstract switchState(state: ActorStateConstructor, setup: any): ActorStateInterface
  abstract getActionOwner(actionConstructor: ActorActionConstructor): ActorInterface | ActorStateInterface | undefined
  abstract playAnimation(animation: (B extends SpriteInterface ? SpriteAnimation : MeshAnimation) | FlexId, loopOverride?: boolean, completed?: () => void): void
  abstract stopAnimation(): void
  abstract playAction(action: ActorActionConstructor | ((delta: number) => void), setup: any): ActorActionInterface
  abstract stopAction(action: ActorActionConstructor): void
  abstract playActionGroup(group: FlexId): void
  abstract stopActionGroup(group: FlexId): void
  abstract stopActionAll(): void
  abstract removeAction(actionConstructor: ActorActionConstructor, forceRemove?: boolean): void
  abstract removeActionGroup(group: FlexId, forceRemove?: boolean): void
  abstract removeActionAll(forceRemove?: boolean): void
  abstract getAction(actionConstructor: ActorActionConstructor): ActorActionInterface | undefined
  abstract attachParticle(Particle: ParticleConstructor | ((particle: ParticleInterface) => void), id: FlexId, offset: BABYLON.Vector3, nodeName?: string): void
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
  onDestroy?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
