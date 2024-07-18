// import { StateInterface } from '../../../base'
import { Observer } from '@babylonjs/core'

import { Rect } from '../../../models/rect'
import { ActorInterface } from '../actor-interface'
import { ActorActionProps } from './actor-action-props'

export abstract class ActorActionInterface<S = any> /* extends StateInterface<S> */ { // 8a8f
  abstract props?: ActorActionProps

  /**
   * User available
   */
  abstract actor: ActorInterface<any>
  abstract loopUpdate$?: Observer<number>
  abstract canvasResize$?: Observer<Rect>
  abstract start?(): void
  abstract stop?(): void

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
  onStop?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
