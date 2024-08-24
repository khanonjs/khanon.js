import { Notificable } from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { FlexId } from '../../types'
import { AppProps } from './app-props'
import { AppPropsDefault } from './app.props.deafult'

export abstract class AppInterface implements Notificable {
  props?: AppProps & AppPropsDefault
  metadata?: Metadata

  /**
   * User available
   */
  abstract notify(message: FlexId, ...args: any[]): void

  /**
   * User defined mandatory (abstract on .d.ts)
   */
  onStart?(): void
  onError?(error?: string): void

  /**
   * User defined optional
   */
  onClose?(): void
}
