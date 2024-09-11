import { GUIConstructor } from '../../gui/gui-constructor'
import { SceneConstructor } from '../../scene/scene-constructor'

export interface AppStateProps {
  scenes?: SceneConstructor[]
  guis?: GUIConstructor[]
}
