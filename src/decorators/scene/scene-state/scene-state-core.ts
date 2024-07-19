import { StateCore } from '../../../base'
import { SceneType } from '../scene-type'
import { SceneStateInterface } from './scene-state-interface'

export abstract class SceneStateCore extends StateCore<SceneType, SceneStateInterface> {}
