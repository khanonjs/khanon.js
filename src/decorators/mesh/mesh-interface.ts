import { Mesh as BabylonMesh } from '@babylonjs/core'

import { DisplayObject } from '../../base/classes/display-object'
import { BabylonAccessor } from '../../models'
import { SceneInterface } from '../scene/scene-interface'
import { SceneType } from '../scene/scene-type'

export abstract class MeshInterface extends DisplayObject {
  /**
   * Public
   */
  abstract babylon: Pick<BabylonAccessor, 'scene' | 'mesh'>
  abstract scene: SceneType
  abstract setMesh(babylonMesh: BabylonMesh): void
  abstract setScale(scale: number): void
  abstract getScale(): number

  /**
   * User defined
   */
  abstract onSpawn?(scene: SceneInterface): void

  /**
   * Private
   */
  abstract release?(): void
}
