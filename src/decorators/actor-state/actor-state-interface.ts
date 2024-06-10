import { LoopUpdatable } from '../../base'
import { ActorInterface } from '../actor/actor-interface'

export class ActorStateInterface implements LoopUpdatable {
  start?(actor: ActorInterface): void
  end?(): void
  onStart?(): void
  onEnd?(): void
  loopUpdate?(delta: number): void
}
