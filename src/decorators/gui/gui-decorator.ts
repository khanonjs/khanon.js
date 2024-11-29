import { LoadingProgress } from '../../base'
import { SceneInterface } from '../scene/scene-interface'
import { GUICore } from './gui-core'
import { GUIProps } from './gui-props'

export function GUI(props: GUIProps): any {
  return function <T extends { new (...args: any[]): GUICore }>(constructor: T & GUICore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements GUICore {
      props = props
      load(owner?: SceneInterface): LoadingProgress {
        return null as any
      }

      unload(owner?: SceneInterface): void {

      }
    }
    return _class
  }
}
