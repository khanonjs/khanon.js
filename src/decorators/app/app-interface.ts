import { Notificable } from '../../base'
import { FlexId } from '../../types'

export abstract class AppInterface implements Notificable {
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
