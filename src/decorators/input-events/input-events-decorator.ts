import { LoadingProgress } from '../../base/loading-progress/loading-progress'
import { InputEventsController } from '../../controllers'
import { InputEventsInterface } from './input-events-interface'
import { InputEventsProps } from './input-events-props'

export function InputEvents(props: InputEventsProps = {}): any {
  return function <T extends { new (...args: any[]): InputEventsInterface }>(constructor: T & InputEventsInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor implements InputEventsInterface {
      /* constructor() {

      } */
      _load(owner?: any): LoadingProgress {
        return null as any
      }

      _unload(owner?: any): void {

      }
    }
    InputEventsController.register(new _class())
    return _class
  }
}
