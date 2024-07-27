import { Core } from '../core'
import { ActorInterface } from '../decorators/actor/actor-interface'
import { ActorStateInterface } from '../decorators/actor/actor-state/actor-state-interface'
import { AppInterface } from '../decorators/app/app-interface'
import { SceneInterface } from '../decorators/scene/scene-interface'
import { SceneStateInterface } from '../decorators/scene/scene-state/scene-state-interface'
import { Logger } from '../modules/logger'
import { FlexId } from '../types'
import { NotificableType } from '../types/notificable-type'
import { isPrototypeOf } from '../utils/utils'
import { ScenesController } from './scenes-controller'

// TODO This could be optimized storing each actor in a Map<ActorConstructor, Observable>
export class NotificationsController {
  static send(message: FlexId, elements: NotificableType | NotificableType[], ...args: any[]): void {
    if (Array.isArray(elements)) {
      elements.forEach(element => NotificationsController.sendConstructor(message, element, args))
    } else {
      NotificationsController.sendConstructor(message, elements, args)
    }
  }

  private static sendConstructor(message: FlexId, constructor: NotificableType, args: any[]) {
    if (isPrototypeOf(AppInterface, constructor)) {
      Core.getApp().notify(message, ...args)
    } else {
      if (isPrototypeOf(ActorInterface, constructor)) {
        Core.getActiveScenes().forEach(scene => scene.actors.forEach(actor => {
          if (actor instanceof constructor) {
            actor.notify(message, ...args)
          }
        }))
      } else if (isPrototypeOf(ActorStateInterface, constructor)) {
        Core.getActiveScenes().forEach(scene => scene.actors.forEach(actor => {
          if (actor.state instanceof constructor) {
            actor.state.notify(message, ...args)
          }
        }))
      } else if (isPrototypeOf(SceneInterface, constructor)) {
        const scene = ScenesController.get(constructor)
        if (scene && scene.started) {
          scene.notify(message, ...args)
        }
      } else if (isPrototypeOf(SceneStateInterface, constructor)) {
        Core.getActiveScenes().forEach(scene => {
          if (scene.state instanceof constructor) {
            scene.state.notify(message, ...args)
          }
        })
      }
    }
  }
}
