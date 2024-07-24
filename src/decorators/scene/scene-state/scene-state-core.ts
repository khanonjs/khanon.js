import { StateCore } from '../../../base'
import { SceneInterface } from '../scene-interface'
import { SceneStateInterface } from './scene-state-interface'

export abstract class SceneStateCore extends StateCore<SceneInterface, SceneStateInterface> {}
