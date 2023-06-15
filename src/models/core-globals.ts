import { Subject } from 'rxjs'

import { DimensionsWH } from './dimensions-wh'

// 8a8f qué hacer con esto?
export class CoreGlobals {
  /** Properties */
  static canvas: HTMLCanvasElement
  static isDevelopmentMode: boolean
  static canvasDimensions: DimensionsWH
  /** Outputs */
  static canvasResize$: Subject<DimensionsWH> = new Subject<DimensionsWH>()
  static loopUpdate$: Subject<void> = new Subject<void>()
  static physicsUpdate$: Subject<void> = new Subject<void>()
  /** Inputs */
  static onError$: Subject<string> = new Subject<string>()
}
