import { Core } from '../../core'
import { applyDefaults } from '../../helpers/utils'
import { AppCore } from './app-core'
import { AppProps } from './app-props'
import { appPropsDefault } from './app.props.deafult'

export function App(props: AppProps): any {
  return function <T extends { new (...args: any[]): any }>(constructor: T & AppCore, context: ClassDecoratorContext) {
    const _class = class extends constructor implements AppCore {
      // Core
      props = applyDefaults(props, appPropsDefault)
    }
    Core.initialize(new _class())
    return _class
  }
}
