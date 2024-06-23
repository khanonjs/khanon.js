import { ActorEventInterface } from '../decorators/actor/actor-event/actor-event-interface'
import { ActorInterface } from '../decorators/actor/actor-interface'
import { ActorStateInterface } from '../decorators/actor/actor-state/actor-state-interface'
import { AppInterface } from '../decorators/app/app-interface'
import { CameraInterface } from '../decorators/camera/camera-interface'
import { GUIInterface } from '../decorators/gui/gui-interface'
import { MeshInterface } from '../decorators/mesh/mesh-interface'
import { MeshMapInterface } from '../decorators/meshmap/meshmap-interface'
import { MotionInterface } from '../decorators/motion/motion-interface'
import { ParticleSourceInterface } from '../decorators/particle-source/particle-source-interface'
import { ParticleInterface } from '../decorators/particle/particle-interface'
import { SceneEventInterface } from '../decorators/scene-event/scene-event-interface'
import { SceneStateInterface } from '../decorators/scene-state/scene-state-interface'
import { SceneInterface } from '../decorators/scene/scene-interface'
import { SpriteInterface } from '../decorators/sprite/sprite-interface'
import { TileMapInterface } from '../decorators/tilemap/tilemap-interface'

export type ActorConstructor = new () => ActorInterface
export type ActorEventConstructor = new () => ActorEventInterface
export type ActorStateConstructor = new () => ActorStateInterface
export type AppConstructor = new () => AppInterface
export type CameraConstructor = new () => CameraInterface
export type GUIConstructor = new () => GUIInterface
export type MeshConstructor = new () => MeshInterface
export type MeshMapConstructor = new () => MeshMapInterface
export type MotionConstructor = new () => MotionInterface
export type ParticleConstructor = new () => ParticleInterface
export type ParticleSourceConstructor = new () => ParticleSourceInterface
export type SceneConstructor = new () => SceneInterface
export type SceneEventConstructor = new () => SceneEventInterface
export type SceneStateConstructor = new () => SceneStateInterface
export type TileMapConstructor = new () => TileMapInterface
export type SceneMapConstructor = MeshMapConstructor | TileMapConstructor
export type SpriteConstructor = new () => SpriteInterface
