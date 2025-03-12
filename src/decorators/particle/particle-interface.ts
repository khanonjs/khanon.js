import * as BABYLON from '@babylonjs/core'

import {
  CanvasResizable,
  LoopUpdatable,
  Notificable
} from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { TimersByContext } from '../../base/interfaces/timers-by-context'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { FlexId } from '../../types/flex-id'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from '../sprite/sprite-animation'
import { SpriteConstructor } from '../sprite/sprite-constructor'
import { SpriteProps } from '../sprite/sprite-props'
import { ParticleAttachmentInfo } from './particle-attachment-info'
import { ParticleProps } from './particle-props'

export abstract class ParticleInterface implements LoopUpdatable, CanvasResizable, Notificable, TimersByContext {
  abstract _props: ParticleProps
  abstract _className: string
  abstract _metadata: Metadata
  abstract _loopUpdate: boolean
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract _attachmentInfo: ParticleAttachmentInfo
  abstract _attachmentUpdate$: BABYLON.Observer<number> | undefined
  abstract _animations: SpriteAnimation[] | null
  abstract _spriteProps: SpriteProps
  abstract _offset: BABYLON.Vector3
  abstract _create(): void
  abstract _updatePosition(): void
  abstract _release(): void

  /**
   * User available
   */
  abstract babylon: Pick<BabylonAccessor, 'scene' | 'particleSystem'>
  abstract scene: SceneInterface
  abstract loopUpdate: boolean
  abstract getClassName(): string
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(timeout: Timeout): void
  abstract clearAllTimeouts(): void
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
