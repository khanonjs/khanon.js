import * as BABYLON from '@babylonjs/core'

export abstract class LoopUpdatable {
  abstract _loopUpdate: boolean
  abstract loopUpdate: boolean
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract onLoopUpdate?(delta: number): void
}
