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
  abstract _load(owner?: SceneInterface): LoadingProgress
  abstract _unload(owner?: SceneInterface): void
  abstract spawn(scene: SceneInterface): GUIInterface
  abstract getClassName(): string
}
