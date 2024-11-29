import {
  Loadable,
  LoadingProgress
} from '../../base'
import { SceneInterface } from '../scene/scene-interface'
import { GUIProps } from './gui-props'

export abstract class GUICore implements Loadable {
  abstract props: GUIProps
  abstract load(owner?: SceneInterface): LoadingProgress
  abstract unload(owner?: SceneInterface): void
}
