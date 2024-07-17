import { Observer } from '@babylonjs/core'

import { ActorInterface } from '../'
import { Rect } from '../../../models/rect'
import { ActorStateProps } from './actor-state-props'

export { ActorStateProps } from './'
export declare function ActorState(props?: ActorStateProps): any
export declare class ActorStateOptions<S> {
  setup(vars: S): void
}
export declare abstract class ActorStateInterface<S = any> {
  actor: ActorInterface
  setup: S
  loopUpdate: boolean

  onStart?(): void
  onSetup?(): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
