import { Spawnable } from '../../base'
import { SceneStateInterface } from './scene-state-interface'
import { SceneStateProps } from './scene-state-props'

export abstract class SceneStateCore implements Spawnable<SceneStateInterface> {
  abstract props: SceneStateProps
  abstract Instance: SceneStateInterface // Disambiguate core methods from interface spawnable instances
  abstract spawn(): SceneStateInterface
}
