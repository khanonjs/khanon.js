import { Notificable } from '../../base'
import { FlexId } from '../../types'
import { AppMetadata } from './app-metadata'
import { AppProps } from './app-props'
import { AppPropsDefault } from './app.props.deafult'

export abstract class AppInterface implements Notificable {
  props?: AppProps & AppPropsDefault
  metadata?: AppMetadata

  /**
   * User available
   */
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined
   */
  onStart?(): void
  onError?(error?: string): void
  onClose?(): void
}
