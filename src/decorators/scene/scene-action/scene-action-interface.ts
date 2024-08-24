import { ActionInterface } from '../../../base'
import { SceneInterface } from '../scene-interface'
import { SceneActionProps } from './scene-action-props'

export abstract class SceneActionInterface<S = any, C extends SceneInterface = SceneInterface> extends ActionInterface<S> {
  abstract props?: SceneActionProps

  /**
   * User available
   */
  abstract get scene(): C
}
