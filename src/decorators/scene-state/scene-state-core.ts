import { Spawnable } from '../../base'
import { SceneStateConstructor } from '../../constructors'
import { SceneStateInterface } from './scene-state-interface'
import { SceneStateProps } from './scene-state-props'

export abstract class SceneStateCore implements Spawnable<SceneStateConstructor, SceneStateInterface> {
  abstract props: SceneStateProps
  abstract Instance: SceneStateConstructor // Disambiguate core methods from interface spawnable instances
  abstract InstanceReference: SceneStateInterface
  abstract spawn(): SceneStateInterface
}
