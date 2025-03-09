import { Notificable } from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { LoadingProgress } from '../../base/loading-progress/loading-progress'
import { FlexId } from '../../types/flex-id'
import { AppProps } from './app-props'
import { AppStateConstructor } from './app-state/app-state-constructor'
import { AppStateInterface } from './app-state/app-state-interface'
import { AppPropsDefault } from './app.props.deafult'

export abstract class AppInterface implements Notificable {
  abstract props: AppProps & AppPropsDefault
  abstract _metadata: Metadata
  abstract _state: AppStateInterface | null

  /**
   * User available
   */
  abstract get state(): AppStateInterface | null
  abstract getClassName(): string
  abstract switchState(state: AppStateConstructor, setup: any): LoadingProgress
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
