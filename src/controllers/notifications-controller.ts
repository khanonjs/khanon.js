import { AppInterface } from '../decorators/app/app-interface'
import { Logger } from '../modules/logger'
import { FlexId } from '../types'
import { NotificableType } from '../types/notificable-type'
import { isPrototypeOf } from '../utils/utils'

// 8a8f
// Notifications are subscribed here by actor, scene, all
// When a notification is thrown, emitter emits it to all its observers
export class NotificationsController {
  static send(message: FlexId, elements: NotificableType | NotificableType[]): void {
  //   AppInterface |
  // ActorInterface<any> | ActorInterface<any>[] |
  // ActorStateInterface | ActorStateInterface[] |
  // SceneInterface | SceneInterface[] |
  // SceneStateInterface | SceneStateInterface[]
    if (Array.isArray(elements)) {

    } else {
      NotificationsController.sendConstructor(message, elements)
    }
  }

  private static sendConstructor(message: FlexId, element: NotificableType) {
    Logger.trace('aki proto AppInterface', isPrototypeOf(element, AppInterface))
  }
}
