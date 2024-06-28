import { Observer } from '@babylonjs/core'

import { LoopUpdatable } from '../../../base'
import { ActorInterface } from '../actor-interface'

export abstract class ActorStateInterface implements LoopUpdatable {
  abstract loopUpdate?: boolean
  abstract loopUpdate$: Observer<number>
  abstract start?(actor: ActorInterface): void
  abstract end?(): void
  onStart?(): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
}
