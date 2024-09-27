import * as BABYLON from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable,
  Notificable
} from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { FlexId } from '../../types/flex-id'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from '../sprite/sprite-animation'
import { SpriteConstructor } from '../sprite/sprite-constructor'
import { SpriteProps } from '../sprite/sprite-props'
import { ParticleAttachmentInfo } from './particle-attachment-info'
import { ParticleProps } from './particle-props'

export abstract class ParticleInterface implements LoopUpdatable, CanvasResizable, Notificable {
  abstract props: ParticleProps
  abstract metadata: Metadata
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract attachmentInfo: ParticleAttachmentInfo
  abstract attachmentUpdate$: BABYLON.Observer<number>
  abstract animations: SpriteAnimation[] | null
  abstract spriteProps: SpriteProps
  abstract offset: BABYLON.Vector3
  abstract create(): void
  abstract updatePosition(): void
  abstract release(): void

  /**
   * User available
   */
  abstract babylon: Pick<BabylonAccessor, 'scene' | 'particleSystem'>
  abstract scene: SceneInterface
  abstract loopUpdate: boolean
  abstract start(): void
  abstract stop(): void
  abstract setSprite(sprite: SpriteConstructor): void
  abstract setAnimation(id: FlexId, cellChangeSpeed?: number, randomStartCell?: boolean): void
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined mandatory (abstract on .d.ts)
   */
  onInitialize?(particle: ParticleInterface): void

  /**
   * User defined optional
   */
  onStart?(): void
  onStop?(): void
  onRemove?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
