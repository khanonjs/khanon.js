import { Observer } from '@babylonjs/core'

export abstract class LoopUpdatable {
  abstract loopUpdate$?: Observer<number>
  abstract onLoopUpdate?(delta: number): void
}
