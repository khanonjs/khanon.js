import * as BABYLON from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable,
  Notificable
} from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { FlexId } from '../../types'
import { SceneInterface } from '../scene/scene-interface'
import { ParticleProps } from './particle-props'

export abstract class ParticleInterface implements LoopUpdatable, CanvasResizable, Notificable {
  abstract props?: ParticleProps
  abstract metadata?: Metadata
  abstract loopUpdate$?: BABYLON.Observer<number>
  abstract canvasResize$?: BABYLON.Observer<Rect>
  abstract start?(): void
  abstract stop?(): void

  /**
   * User available
   */
  abstract babylon: Pick<BabylonAccessor, 'scene' | 'particleSystem'>
  abstract scene: SceneInterface
  abstract loopUpdate: boolean
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined mandatory (abstract on .d.ts)
   */
  initialize?(particle: BABYLON.ParticleSystem): void

  /**
   * User defined optional
   */
  onStart?(): void
  onStop?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
