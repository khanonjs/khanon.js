import * as BABYLON from '@babylonjs/core'

import { ActionInterface } from '../../../base'
import { Metadata } from '../../../base/interfaces/metadata/metadata'
import { Rect } from '../../../models/rect'
import { MeshInterface } from '../../mesh/mesh-interface'
import { SceneInterface } from '../../scene/scene-interface'
import { SpriteInterface } from '../../sprite/sprite-interface'
import { ActorInterface } from '../actor-interface'
import { ActorActionProps } from './actor-action-props'

export abstract class ActorActionInterface<S = any, A = ActorInterface<SpriteInterface | MeshInterface>> implements ActionInterface<S> {
  abstract props: ActorActionProps
  abstract countFramesUpdate$: BABYLON.Observer<number>
  abstract countFrames: number
  abstract metadata: Metadata
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract start(setup: S): void

  /**
   * User available
   */
  abstract actor: A
  abstract setup: S
  abstract set loopUpdate(value: boolean)
  abstract get loopUpdate(): boolean
  abstract get scene(): SceneInterface
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
