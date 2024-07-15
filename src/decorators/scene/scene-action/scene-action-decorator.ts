import { SceneActionsController } from '../../../controllers'
import { SceneType } from '../scene-type'
import { SceneActionCore } from './scene-action-core'
import { SceneActionInterface } from './scene-action-interface'
import { SceneActionProps } from './scene-action-props'

/**
 * Diferenciate from BabylonJs.actionManager: https://doc.babylonjs.com/features/featuresDeepDive/events/actions
 * @param props
 * @returns
 */
export function SceneAction(props: SceneActionProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & SceneActionInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements SceneActionInterface {
      constructor(readonly scene: SceneType, readonly props: any) {
        super()
      }
    }
    const _classCore = class implements SceneActionCore {
      props = props
      Instance: SceneActionInterface = new _classInterface(null, null)

      spawn(scene: SceneType, props: any): SceneActionInterface {
        const actorAction = new _classInterface(scene, props)
        return actorAction
      }
    }
    SceneActionsController.register(new _classCore())
    return _classInterface
  }
}
