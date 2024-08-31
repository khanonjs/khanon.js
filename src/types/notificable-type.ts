import { ActorConstructor } from '../decorators/actor/actor-constructor'
import { ActorStateConstructor } from '../decorators/actor/actor-state/actor-state-constructor'
import { AppConstructor } from '../decorators/app/app-constructor'
import { AppStateConstructor } from '../decorators/app/app-state/app-state-constructor'
import { ParticleConstructor } from '../decorators/particle/particle-constructor'
import { SceneConstructor } from '../decorators/scene/scene-constructor'
import { SceneStateConstructor } from '../decorators/scene/scene-state/scene-state-constructor'

export type NotificableType =
  AppConstructor |
  AppStateConstructor |
  ActorConstructor |
  ActorStateConstructor |
  SceneConstructor |
  SceneStateConstructor |
  ParticleConstructor
