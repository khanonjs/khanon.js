import {
  LoadingProgress,
  StateCore
} from '../../../base'
import { SceneInterface } from '../scene-interface'
import { SceneStateInterface } from './scene-state-interface'
import { SceneStateProps } from './scene-state-props'

export abstract class SceneStateCore implements StateCore<SceneInterface, SceneStateInterface, SceneInterface> {
  abstract props: SceneStateProps
  abstract Instance: SceneStateInterface // Disambiguate core methods from interface spawnable instances
  abstract spawn(owner: SceneInterface): SceneStateInterface
  abstract _load(owner: SceneInterface): LoadingProgress
  abstract _unload(owner: SceneInterface): void
  abstract getClassName(): string
}
