import { Core } from '../../core'
import { applyDefaults } from '../../helpers/utils'
import { AppCore } from './app-core'
import { AppProps } from './app-props'
import { AppType } from './app-type'
import { appPropsDefault } from './app.props.deafult'

export function App(props: AppProps): any {
  return function <T extends { new (...args: any[]): AppType }>(constructor: T & AppType, context: ClassDecoratorContext) {
    const _class = class extends constructor implements AppCore {
      props = applyDefaults(props, appPropsDefault)
    }
    Core.initialize(new _class())
    return _class
  }
}
