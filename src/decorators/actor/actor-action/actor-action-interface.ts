// import { StateInterface } from '../../../base'
import { Observer } from '@babylonjs/core'

import { Rect } from '../../../models/rect'
import { ActorInterface } from '../actor-interface'

export abstract class ActorActionInterface<S = any> /* extends StateInterface<S> */ { // 8a8f
  /**
   * User available
   */
  abstract actor: ActorInterface

  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>
  abstract start?(): void
  abstract end?(): void

  /**
   * User available
   */
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
