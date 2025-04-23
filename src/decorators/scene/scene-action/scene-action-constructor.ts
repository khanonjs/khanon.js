import { SceneInterface } from '../scene-interface'
import { SceneActionInterface } from './scene-action-interface'

export type SceneActionConstructor = new (scene: SceneInterface) => SceneActionInterface
