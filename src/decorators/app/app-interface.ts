import { Notificable } from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { FlexId } from '../../types/flex-id'
import { AppProps } from './app-props'
import { AppStateConstructor } from './app-state/app-state-constructor'
import { AppStateInterface } from './app-state/app-state-interface'
import { AppPropsDefault } from './app.props.deafult'

export abstract class AppInterface implements Notificable {
  abstract props: AppProps & AppPropsDefault
  abstract metadata: Metadata
  abstract _state: AppStateInterface

  /**
   * User available
   */
  abstract get state(): AppStateInterface
  abstract startState(state: AppStateConstructor, setup: any): AppStateInterface
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
