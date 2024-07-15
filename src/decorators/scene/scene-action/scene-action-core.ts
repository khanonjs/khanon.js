import { Spawnable } from '../../../base'
import { SceneType } from '../scene-type'
import { SceneActionInterface } from './scene-action-interface'
import { SceneActionProps } from './scene-action-props'

export abstract class SceneActionCore implements Spawnable<SceneActionInterface> {
  abstract props: SceneActionProps
  abstract Instance: SceneActionInterface // Disambiguate core methods from interface spawnable instances
  abstract spawn(scene: SceneType, props: any): SceneActionInterface
}
