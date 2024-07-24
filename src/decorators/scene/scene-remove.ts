import { Logger } from '../../modules/logger'
import { SceneType } from './scene-type'

// TODO add support to inject a user defined SceneRemove class into the scene?
export class SceneRemove {
  private readonly scene?: SceneType
  private readonly scenePrototype?: any

  constructor(scene: SceneType, scenePrototype: any) {
    this.scene = scene
    this.scenePrototype = scenePrototype
  }
}
