import { Observer } from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable
} from '../../../base'
import { Rect } from '../../../models/rect'
import { ActorInterface } from '../actor-interface'

export abstract class ActorStateInterface<S = any> implements LoopUpdatable, CanvasResizable {
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>
  abstract start?(): void
  abstract end?(): void

  /**
   * User available
   */
  abstract actor: ActorInterface
  abstract setup: S
  abstract loopUpdate: boolean

  /**
   * User defined
   */
  onStart?(): void
  onSetup?(): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
