import { Core } from '../base/core/core'
import { ActorInterface } from '../decorators/actor/actor-interface'
import { ActorStateInterface } from '../decorators/actor/actor-state/actor-state-interface'
import { AppInterface } from '../decorators/app/app-interface'
import { ParticleInterface } from '../decorators/particle/particle-interface'
import { SceneInterface } from '../decorators/scene/scene-interface'
import { SceneStateInterface } from '../decorators/scene/scene-state/scene-state-interface'
import { Logger } from '../modules/logger'
import { FlexId } from '../types/flex-id'
import { NotificableType } from '../types/notificable-type'
import { isPrototypeOf } from '../utils/utils'
import { ScenesController } from './scenes-controller'

// IMPROVE This must be optimized storing each actor, particle, etc.. in a Map<ActorConstructor, Observable>
export class NotificationsController {
  static send(id: FlexId, receivers?: NotificableType | NotificableType[], ...args: any[]): void {
    if (!receivers) {
      // IMPROVE Improve the performance.
      NotificationsController.sendConstructor(id, undefined, args)
    } else
      if (Array.isArray(receivers)) {
        receivers.forEach(element => NotificationsController.sendConstructor(id, element, args))
      } else {
        NotificationsController.sendConstructor(id, receivers, args)
      }
  }

  private static sendConstructor(message: FlexId, constructor?: NotificableType, args: any[] = []) {
    if (!constructor || isPrototypeOf(AppInterface, constructor)) {
      Core.getApp().notify(message, ...args)
    }
    if (constructor) {
      if (isPrototypeOf(SceneInterface, constructor)) {
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
      } else if (isPrototypeOf(ActorInterface, constructor)) {
        Core.getActiveScenes().forEach(scene => scene._actors.forEach(actor => {
          if (actor instanceof constructor) {
            actor.notify(message, ...args)
          }
        }))
      } else if (isPrototypeOf(ActorStateInterface, constructor)) {
        Core.getActiveScenes().forEach(scene => scene._actors.forEach(actor => {
          if (actor.state instanceof constructor) {
            actor.state.notify(message, ...args)
          }
        }))
      } else if (isPrototypeOf(ParticleInterface, constructor)) {
        Core.getActiveScenes().forEach(scene => scene._actors.forEach(actor => {
          actor._particles.forEach(particle => {
            if (particle instanceof constructor) {
              particle.notify(message, ...args)
            }
          })
        }))
      }
    } else {
      Core.getActiveScenes().forEach(scene => {
        if (scene.started) {
          scene.notify(message, ...args)
        }
        scene.state?.notify(message, ...args)
        scene._actors.forEach(actor => {
          actor.notify(message, ...args)
          actor.state?.notify(message, ...args)
        })
        scene._actors.forEach(actor => {
          actor._particles.forEach(particle => {
            particle.notify(message, ...args)
          })
        })
      })
    }
  }
}
