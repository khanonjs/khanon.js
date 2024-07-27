import { ActorInterface } from '../decorators/actor'
import { ActorActionInterface } from '../decorators/actor/actor-action'
import { ActorStateInterface } from '../decorators/actor/actor-state'
import { AppInterface } from '../decorators/app'
import { MeshInterface } from '../decorators/mesh'
import { SceneInterface } from '../decorators/scene'
import { SceneActionInterface } from '../decorators/scene/scene-action'
import { SceneStateInterface } from '../decorators/scene/scene-state'
import { SpriteInterface } from '../decorators/sprite'

export type NotificableType =
  AppInterface |
  ActorInterface<SpriteInterface> | ActorInterface<SpriteInterface>[] |
  ActorInterface<MeshInterface> | ActorInterface<MeshInterface>[] |
  ActorStateInterface | ActorStateInterface[] |
  ActorActionInterface | ActorActionInterface[] |
  SceneInterface | SceneInterface[] |
  SceneStateInterface | SceneStateInterface[] |
  SceneActionInterface | SceneActionInterface[]
