import * as BABYLON from '@babylonjs/core'

import { ActionInterface } from '../../../base'
import { MeshInterface } from '../../mesh'
import { SpriteInterface } from '../../sprite'
import { ActorInterface } from '../actor-interface'
import { ActorActionProps } from './actor-action-props'

export abstract class ActorActionInterface<S = any, A = ActorInterface<SpriteInterface | MeshInterface>> extends ActionInterface<S> {
  abstract props?: ActorActionProps
  abstract countFramesUpdate$?: BABYLON.Observer<number>
  abstract countFrames?: number

  /**
   * User available
   */
  abstract actor: A
}
