

export abstract class LoopUpdatable {
  abstract _loopUpdate: boolean
  abstract loopUpdate: boolean
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract onLoopUpdate?(delta: number): void
}
