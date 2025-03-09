import * as BABYLON from '@babylonjs/core'

import { StateInterface } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { Rect } from '../../../models/rect'
import { FlexId } from '../../../types/flex-id'
import { MeshInterface } from '../../mesh/mesh-interface'
import { SceneInterface } from '../../scene/scene-interface'
import { SpriteInterface } from '../../sprite/sprite-interface'
import { ActorInterface } from '../actor-interface'
import { ActorStateConstructor } from './actor-state-constructor'
import { ActorStateProps } from './actor-state-props'

export abstract class ActorStateInterface<S = any, A = ActorInterface<SpriteInterface | MeshInterface>, C = SceneInterface> implements StateInterface<S> {
  abstract _props: ActorStateProps
  abstract _metadata: Metadata
  abstract _loopUpdate: boolean
  abstract _loopUpdate$: BABYLON.Observer<number>
  abstract _canvasResize$: BABYLON.Observer<Rect>
  abstract _start(setup: any): void
  abstract _end(): void

  /**
   * User available
   */
  abstract scene: C
  abstract actor: A
  abstract setup: S
  abstract get loopUpdate(): boolean
  abstract set loopUpdate(value: boolean)
  abstract getClassName(): string
  abstract switchState(state: ActorStateConstructor, setup: any): ActorStateInterface
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined optional
   */
  onStart?(): void
  onEnd?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
