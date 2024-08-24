import * as BABYLON from '@babylonjs/core'

export abstract class LoopUpdatable {
  abstract loopUpdate?: boolean
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract onLoopUpdate?(delta: number): void
}
