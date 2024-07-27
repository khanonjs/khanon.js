import * as BABYLON from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable,
  Notificable
} from '../../base'
import { ActorActionConstructor } from '../../constructors/actor-action-constructor'
import { ActorStateConstructor } from '../../constructors/actor-state-constructor'
import { Rect } from '../../models/rect'
import {
  FlexId,
  MeshTransform,
  SpriteTransform
} from '../../types'
import { MeshAnimation } from '../mesh/mesh-animation'
import { MeshInterface } from '../mesh/mesh-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from '../sprite/sprite-animation'
import { SpriteInterface } from '../sprite/sprite-interface'
import { ActorActionInterface } from './actor-action/actor-action-interface'
import { ActorMetadata } from './actor-metadata'
import { ActorProps } from './actor-props'
import { ActorStateInterface } from './actor-state/actor-state-interface'

export abstract class ActorInterface<B extends SpriteInterface | MeshInterface = any> implements LoopUpdatable, CanvasResizable, Notificable {
  abstract metadata?: ActorMetadata
  abstract props?: ActorProps
  abstract scene?: SceneInterface
  abstract loopUpdate: boolean
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract canvasResize$?: BABYLON.Observer<Rect>
  abstract _body?: B
  abstract nodes?: Map<string, B>
  abstract _state?: ActorStateInterface
  abstract actions?: Map<ActorActionConstructor, ActorActionInterface>
  abstract initialize?(props: ActorProps): void
  abstract release?(): void
  abstract stopActionFromInstance?(instance: ActorActionInterface): void

  /**
   * User available
   */
  abstract transform: B extends SpriteInterface ? SpriteTransform : MeshTransform
  abstract body: B
  abstract get state(): ActorStateInterface
  abstract setBody(Body: new () => B): B
  abstract addNode(Node: B, name: string): B
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
  abstract notify(message: FlexId, ...args: any[]): void
  abstract destroy(): void

  /**
   * User defined
   */
  onSpawn?(): void
  onDestroy?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
