import { AppProps } from './app-props'
import { AppPropsDefault } from './app.props.deafult'

export abstract class AppCore {
  props: AppProps & AppPropsDefault
}
