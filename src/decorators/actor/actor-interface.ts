import { Observer } from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable
} from '../../base'
import {
  MeshConstructor,
  SpriteConstructor
} from '../../constructors'
import { Rect } from '../../models'
import {
  MeshTransform,
  SpriteTransform
} from '../../types'
import { MeshInterface } from '../mesh/mesh-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SceneType } from '../scene/scene-type'
import { SpriteInterface } from '../sprite/sprite-interface'
import { ActorComposition } from './actor-composition'
import { ActorMetadata } from './actor-metadata'

export abstract class ActorInterface<B extends SpriteInterface | MeshInterface = any> implements LoopUpdatable, CanvasResizable {
  /**
   * Private
   */
  protected abstract metadata?: ActorMetadata
  abstract scene?: SceneType
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>
  abstract release?(): void

  /**
   * Public
   */
  abstract transform: B extends SpriteInterface ? SpriteTransform : MeshTransform
  abstract composition: ActorComposition<B>

  /**
   * User defined
   */
  onSpawn?(scene: SceneInterface): void
  onSpawn?(scene: SceneInterface): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
