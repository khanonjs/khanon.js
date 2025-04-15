import {
  LoadingProgress,
  StateCore
} from '../../../base'
import { SceneInterface } from '../../scene/scene-interface'
import { GUIInterface } from '../gui-interface'
import { GUIStateInterface } from './gui-state-interface'
import { GUIStateProps } from './gui-state-props'

export abstract class GUIStateCore implements StateCore<GUIInterface, GUIStateInterface, SceneInterface> {
  abstract props: GUIStateProps
  abstract Instance: GUIStateInterface // Disambiguate core methods from interface spawnable instances
  abstract spawn(owner: GUIInterface): GUIStateInterface
  abstract load(owner: SceneInterface): LoadingProgress
  abstract unload(owner: SceneInterface): void
  abstract getClassName(): string
}
