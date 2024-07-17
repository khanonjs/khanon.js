import { Observer } from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable
} from '../../base'
import { ActorActionConstructor } from '../../constructors/actor-action-constructor'
import { ActorStateConstructor } from '../../constructors/actor-state-constructor'
import { Rect } from '../../models/rect'
import {
  MeshTransform,
  SpriteTransform
} from '../../types'
import { MeshInterface } from '../mesh/mesh-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SceneType } from '../scene/scene-type'
import { SpriteInterface } from '../sprite/sprite-interface'
import { ActorMetadata } from './actor-metadata'
import { ActorProps } from './actor-props'
import { ActorStateInterface } from './actor-state/actor-state-interface'
import { ActorStateOptions } from './actor-state/actor-state-options'

export abstract class ActorInterface<B extends SpriteInterface | MeshInterface = any> implements LoopUpdatable, CanvasResizable {
  abstract metadata?: ActorMetadata
  abstract props?: ActorProps
  abstract scene?: SceneType
  abstract loopUpdate: boolean
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>
  abstract _body?: B
  abstract _state?: ActorStateInterface
  abstract nodes?: Map<string, B>
  abstract initialize?(props: ActorProps): void
  abstract release?(): void

  /**
   * User available
   */
  abstract transform: B extends SpriteInterface ? SpriteTransform : MeshTransform
  abstract body: B
  abstract get state(): ActorStateInterface
  abstract setBody<B>(Body: new () => B): B
  abstract addNode<B>(Node: B, name: string): B
  abstract getNode(name: string): B
  abstract removeBody(): void
  abstract removeNode(name: string): void
  abstract clearNodes(includeBody: boolean): void
  abstract setVisible(value: boolean): void
  abstract startState(state: ActorStateConstructor): ActorStateOptions<any>
  abstract playAction(action: ActorActionConstructor, props: any): void

  /**
   * User defined
   */
  onSpawn?(scene: SceneInterface): void
  onSpawn?(scene: SceneInterface): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
