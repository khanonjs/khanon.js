import { Core } from '../../core'
import { FlexId } from '../../types'
import { applyDefaults } from '../../utils/utils'
import { AppInterface } from './app-interface'
import { AppMetadata } from './app-metadata'
import { AppProps } from './app-props'
import { appPropsDefault } from './app.props.deafult'

export function App(props: AppProps): any {
  return function <T extends { new (...args: any[]): AppInterface }>(constructor: T & AppInterface, context: ClassDecoratorContext) {
    const _class = class extends constructor implements AppInterface {
      props = applyDefaults(props, appPropsDefault)
      metadata: AppMetadata = Reflect.getMetadata('metadata', this) ?? new AppMetadata()

      notify(message: FlexId, ...args: any[]): void {
        const definition = this.metadata.notifiers.get(message)
        if (definition) {
          this[definition.methodName](...args)
        }
      }
    }
    Core.initialize(new _class())
    return _class
  }
}
