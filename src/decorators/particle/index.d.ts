import * as BABYLON from '@babylonjs/core'

import {
  BabylonAccessor,
  Rect
} from '../../models'
import { FlexId } from '../../types'
import { SpriteConstructor } from '../sprite'

// 8a8f doc
export abstract class ParticleInterface {
  babylon: Pick<BabylonAccessor, 'scene' | 'particleSystem'>

  loopUpdate: boolean

  notify(message: FlexId, ...args: any[]): void

  abstract initialize(particle: BABYLON.ParticleSystem): void

  onStart?(): void
  onStop?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}

export type ParticleConstructor = new () => ParticleInterface

export interface ParticleProps {
  sprites?: SpriteConstructor[]
  offset?: BABYLON.Vector3 | BABYLON.Matrix
  capacity?: number
}

export function Particle(props?: ParticleProps): any
