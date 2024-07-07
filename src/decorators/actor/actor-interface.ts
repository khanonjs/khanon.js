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
import { ActorComposer } from './actor-composer'
import { ActorMetadata } from './actor-metadata'
import { ActorProps } from './actor-props'

export abstract class ActorInterface<B extends SpriteInterface | MeshInterface = any> implements LoopUpdatable, CanvasResizable {
  /**
   * Private
   */
  abstract metadata?: ActorMetadata
  abstract props?: ActorProps
  abstract scene?: SceneType
  abstract loopUpdate: boolean
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>
  abstract initialize?(props: ActorProps): void
  abstract release?(): void

  /**
   * Public
   */
  abstract transform: B extends SpriteInterface ? SpriteTransform : MeshTransform
  abstract composer: ActorComposer<B>

  /**
   * User defined
   */
  onSpawn?(scene: SceneInterface): void
  onSpawn?(scene: SceneInterface): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
