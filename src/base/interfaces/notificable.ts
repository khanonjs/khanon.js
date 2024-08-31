import { FlexId } from '../../types/flex-id'

/**
 * NOTE: Any new notificable interface must be added to NotificationController methods.
 */
export abstract class Notificable {
  abstract notify(message: FlexId, ...args: any[]): void
}
