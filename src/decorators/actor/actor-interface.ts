import { Observer } from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable
} from '../../base'
import { Rect } from '../../models'
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

export abstract class ActorInterface<B extends SpriteInterface | MeshInterface = any> implements LoopUpdatable, CanvasResizable {
  abstract metadata?: ActorMetadata
  abstract props?: ActorProps
  abstract scene?: SceneType
  abstract loopUpdate: boolean
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>
  abstract _body?: B
  abstract nodes?: Map<string, B>
  abstract initialize?(props: ActorProps): void
  abstract release?(): void

  /**
   * User available
   */
  abstract transform: B extends SpriteInterface ? SpriteTransform : MeshTransform
  abstract setBody<B>(Body: new () => B): B
  abstract addNode<B>(Node: B, name: string): B
  abstract getNode(name: string): B
  abstract setVisible(value: boolean): void

  /**
   * User defined
   */
  onSpawn?(scene: SceneInterface): void
  onSpawn?(scene: SceneInterface): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
