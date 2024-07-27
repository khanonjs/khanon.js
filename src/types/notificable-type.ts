import { ActorInterface } from '../decorators/actor'
import { ActorStateInterface } from '../decorators/actor/actor-state'
import { AppInterface } from '../decorators/app'
import { SceneInterface } from '../decorators/scene'
import { SceneStateInterface } from '../decorators/scene/scene-state'

export type NotificableType =
  AppInterface |
  ActorInterface<any> |
  ActorStateInterface |
  SceneInterface |
  SceneStateInterface
