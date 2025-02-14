import * as BABYLON from '@babylonjs/core'

import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { FlexId } from '../../types/flex-id'

// import { MeshConstructor } from '../mesh/mesh-constructor'
// import { ParticleConstructor } from '../particle/particle-constructor'
// import { SpriteConstructor } from '../sprite/sprite-constructor'
// import { GUIStateConstructor } from './gui-state/gui-state-constructor'
// import { GUIStateInterface } from './gui-state/gui-state-interface'

/**
 * @param S Camera setup object.
 */
export declare abstract class GUIInterface {
  loopUpdate: boolean
  babylon: Pick<BabylonAccessor, 'gui'>

  /**
   * Returns the name of the class.
   */
  getClassName(): string

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
