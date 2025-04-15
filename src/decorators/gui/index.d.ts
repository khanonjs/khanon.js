import * as BABYLON from '@babylonjs/core'

import { Timeout } from '../../models'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { FlexId } from '../../types/flex-id'
import { SceneInterface } from '../scene'

// import { MeshConstructor } from '../mesh/mesh-constructor'
// import { ParticleConstructor } from '../particle/particle-constructor'
// import { SpriteConstructor } from '../sprite/sprite-constructor'
// import { GUIStateConstructor } from './gui-state/gui-state-constructor'
// import { GUIStateInterface } from './gui-state/gui-state-interface'

/**
 * @param S GUI setup object.
 */
export declare abstract class GUIInterface</* Setup object */ S = any> {
  loopUpdate: boolean
  babylon: Pick<BabylonAccessor, 'gui' | 'scene'>

  /**
   * Scene this Mesh belongs to.
   */
  get scene(): SceneInterface

  get setup(): S

  /**
   * Returns the name of the class.
   */
  getClassName(): string

  /**
   * Sets a timeout.
   * This interval relies on the app loopUpdate and it will be triggered on correct frame.
   * It will be removed on context remove.
   * @param func Callback
   * @param ms Milliseconds
   */
  setTimeout(func: () => void, ms: number, context?: any): Timeout

  /**
   * Sets an interval.
   * This interval relies on the app loopUpdate and it will be triggered on correct frame.
   * It will be removed on context remove.
   * @param func Callback
   * @param ms Milliseconds
   */
  setInterval(func: () => void, ms: number): Timeout

  /**
   * Clears a timeout in this context.
   * @param timeout
   */
  clearTimeout(timeout: Timeout): void

  /**
   * Clears an interval in this context.
   * @param timeout
   */
  clearInterval(timeout: Timeout): void

  /**
   * Clear all timeouts and intervals in this context.
   */
  clearAllTimeouts(): void

  notify(message: FlexId, ...args: any[]): void

  /**
   * User defined mandatory (abstract on .d.ts)
   */
  abstract onInitialize?(container: BABYLON.DynamicTexture): void

  /**
   * User defined optional
   */
  onDestroy?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}

export type GUIConstructor = new () => GUIInterface

export declare function GUI(): any
