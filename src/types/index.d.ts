import { ActorConstructor } from '../decorators/actor'
import { ActorStateConstructor } from '../decorators/actor/actor-state'
import { AppConstructor } from '../decorators/app'
import { AppStateConstructor } from '../decorators/app/app-state'
import { ParticleConstructor } from '../decorators/particle'
import { SceneConstructor } from '../decorators/scene'
import { SceneStateConstructor } from '../decorators/scene/scene-state'

export { DeepPartial } from './deep-partial'
export { DeepRequired } from './deep-required'
export { ExtractOptional } from './extract-optional'
export { FlexId } from './flex-id'
export { MeshTransform } from './mesh-transform'
export { SpriteTransform } from './sprite-transform'
export { TimeoutType } from './timeout-type'

export type NotificableType =
  AppConstructor |
  AppStateConstructor |
  ActorConstructor |
  ActorStateConstructor |
  SceneConstructor |
  SceneStateConstructor |
  ParticleConstructor
