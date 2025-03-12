import * as BABYLON from '@babylonjs/core'

import { ActionInterface } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { Rect } from '../../../models/rect'
import { Timeout } from '../../../models/timeout'
import { MeshInterface } from '../../mesh/mesh-interface'
import { SceneInterface } from '../../scene/scene-interface'
import { SpriteInterface } from '../../sprite/sprite-interface'
import { ActorInterface } from '../actor-interface'
import { ActorActionProps } from './actor-action-props'

export abstract class ActorActionInterface<S = any, A = ActorInterface<SpriteInterface | MeshInterface>> implements ActionInterface<S> {
  abstract _props: ActorActionProps
  abstract _className: string
  abstract _countFramesUpdate$: BABYLON.Observer<number> | null
  abstract _countFrames: number
  abstract _metadata: Metadata
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract _loopUpdate: boolean
  abstract _isPlaying: boolean
  abstract _start(setup: S): void

  /**
   * User available
   */
  abstract actor: A
  abstract setup: S
  abstract set loopUpdate(value: boolean)
  abstract get loopUpdate(): boolean
  abstract get scene(): SceneInterface
  abstract get isPlaying(): boolean
  abstract getClassName(): string
  abstract setTimeout(func: () => void, ms: number): Timeout
  abstract setInterval(func: () => void, ms: number): Timeout
  abstract clearTimeout(timeout: Timeout): void
  abstract clearInterval(timeout: Timeout): void
  abstract play(): void
  abstract stop(): void // Callable from user Action, it will call to 'owner.stopActionFromInstance', then owner calls 'action.end' after remove it.
  abstract remove(): void

  /**
   * User defined optional
   */
  onPlay?(): void
  onStop?(): void
  onRemove?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
