import * as BABYLON from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable,
  Notificable
} from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { Rect } from '../../models/rect'
import {
  FlexId,
  MeshTransform,
  SpriteTransform
} from '../../types'
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

export abstract class ActorInterface<B extends SpriteInterface | MeshInterface = any> implements LoopUpdatable, CanvasResizable, Notificable {
  abstract metadata: Metadata
  abstract props: ActorProps
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract _body: B
  abstract nodes: Map<string, B>
  abstract _state: ActorStateInterface
  abstract actions: Map<ActorActionConstructor, ActorActionInterface>
  abstract particles: Map<FlexId, ParticleInterface>
  abstract initialize(props: ActorProps): void
  abstract release(): void
  abstract stopActionFromInstance(instance: ActorActionInterface, forceRemove?: boolean): void

  /**
   * User available
   */
  abstract loopUpdate: boolean
  abstract get transform(): B extends SpriteInterface ? SpriteTransform : MeshTransform
  abstract get scene(): SceneInterface
  abstract get body(): B
  abstract get state(): ActorStateInterface
  abstract setBody(Body: new () => B): B
  abstract addNode(Node: B, name: string, offset: BABYLON.Vector3 | BABYLON.Matrix): B
  abstract getNode(name: string): B
  abstract removeBody(): void
  abstract removeNode(name: string): void
  abstract clearNodes(includeBody: boolean): void
  abstract setVisible(value: boolean): void
  abstract startState(state: ActorStateConstructor, setup: any): void
  abstract playAnimation(animation: (B extends SpriteInterface ? SpriteAnimation : MeshAnimation) | FlexId, loopOverride?: boolean, completed?: () => void): void
  abstract stopAnimation(): void
  abstract playAction(action: ActorActionConstructor | ((delta: number) => void), setup: any): void
  abstract stopAction(action: ActorActionConstructor): void
  abstract stopActionGroup(group: number): void
  abstract stopActionAll(): void
  abstract removeAction(actionConstructor: ActorActionConstructor, forceRemove?: boolean): void
  abstract removeActionGroup(group: number, forceRemove?: boolean): void
  abstract removeActionAll(forceRemove?: boolean): void
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
