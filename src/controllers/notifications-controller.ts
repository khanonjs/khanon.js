import { FlexId } from '../types'
import { NotificableType } from '../types/notificable-type'

// 8a8f
// Notifications are subscribed here by actor, scene, all
// When a notification is thrown, emitter emits it to all its observers
export class NotificationsController {
  static send(message: FlexId, elements: NotificableType): void {

  }
}
