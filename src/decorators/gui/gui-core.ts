import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../../base'
import { SceneInterface } from '../scene/scene-interface'
import { GUIInterface } from './gui-interface'
import { GUIProps } from './gui-props'

export abstract class GUICore implements Loadable, Spawnable<GUIInterface> {
  abstract props: GUIProps
  abstract Instance: GUIInterface // Disambiguate core methods from interface spawnable instances
  abstract load(owner?: SceneInterface): LoadingProgress
  abstract unload(owner?: SceneInterface): void
  abstract spawn(): GUIInterface
  abstract getClassName(): string
}
