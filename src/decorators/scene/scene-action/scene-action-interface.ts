import { SceneType } from '../scene-type'

export interface SceneActionInterface<P = any> {
  props: P
  scene: SceneType
}
