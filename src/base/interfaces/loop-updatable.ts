import { Observer } from '@babylonjs/core/Misc/observable'

export abstract class LoopUpdatable {
  abstract _loopUpdate: boolean
  abstract loopUpdate: boolean
  abstract _loopUpdate$: Observer<number>
  abstract onLoopUpdate?(delta: number): void
}
