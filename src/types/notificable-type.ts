import { ActorConstructor } from '../constructors/actor-constructor'
import { ActorStateConstructor } from '../constructors/actor-state-constructor'
import { AppConstructor } from '../constructors/app-constructor'
import { SceneConstructor } from '../constructors/scene-constructor'
import { SceneStateConstructor } from '../constructors/scene-state-constructor'

export type NotificableType =
  AppConstructor |
  ActorConstructor |
  ActorStateConstructor |
  SceneConstructor |
  SceneStateConstructor
