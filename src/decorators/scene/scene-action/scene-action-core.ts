import { ActionCore } from '../../../base'
import { SceneInterface } from '../scene-interface'
import { SceneActionInterface } from './scene-action-interface'

export abstract class SceneActionCore extends ActionCore<SceneInterface, SceneActionInterface, SceneInterface> {}
