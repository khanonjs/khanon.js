import { LoadingProgress } from '../../base/loading-progress/loading-progress'
import { InputEventsProfileController } from '../../controllers'
import { InputEventsProfileInterface } from './input-events-profile-interface'
import { InputEventsProfileProps } from './input-events-profile-props'

export function InputEventsProfile(props: InputEventsProfileProps = {}): any {
  return function <T extends { new (...args: any[]): InputEventsProfileInterface }>(constructor: T & InputEventsProfileInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor implements InputEventsProfileInterface {
      /* constructor() {

      } */
      _load(owner?: any): LoadingProgress {
        return null as any
      }

      _unload(owner?: any): void {

      }
    }
    InputEventsProfileController.register(new _class())
    return _class
  }
}
