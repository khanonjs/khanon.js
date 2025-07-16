import { ActorConstructor } from '../decorators/actor'
import { ActorStateConstructor } from '../decorators/actor/actor-state'
import { AppConstructor } from '../decorators/app'
import { AppStateConstructor } from '../decorators/app/app-state'
import { ParticleConstructor } from '../decorators/particle'
import { SceneConstructor } from '../decorators/scene'
import { SceneStateConstructor } from '../decorators/scene/scene-state'

export type NotificableType =
  AppConstructor |
  AppStateConstructor |
  ActorConstructor |
  ActorStateConstructor |
  SceneConstructor |
  SceneStateConstructor |
  ParticleConstructor
