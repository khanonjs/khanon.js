import { Core } from '../../core'
import { FlexId } from '../../types'
import { applyDefaults } from '../../utils/utils'
import { AppCore } from './app-core'
import { AppProps } from './app-props'
import { AppType } from './app-type'
import { appPropsDefault } from './app.props.deafult'

export function App(props: AppProps): any {
  return function <T extends { new (...args: any[]): AppType }>(constructor: T & AppType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements AppCore {
      props = applyDefaults(props, appPropsDefault)

      notify(message: FlexId, ...args: any[]): void {
        // 8a8f
      }
    }
    Core.initialize(new _class())
    return _class
  }
}
