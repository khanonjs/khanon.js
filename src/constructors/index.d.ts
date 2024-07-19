import { ActorInterface } from '../decorators/actor'
import { ActorActionInterface } from '../decorators/actor/actor-action'
import { ActorStateInterface } from '../decorators/actor/actor-state'
import { AppInterface } from '../decorators/app'
import { CameraInterface } from '../decorators/camera'
import { GUIInterface } from '../decorators/gui/gui-interface'
import { MeshInterface } from '../decorators/mesh'
import { MeshMapInterface } from '../decorators/meshmap/meshmap-interface'
import { MotionInterface } from '../decorators/motion/motion-interface'
import { ParticleSourceInterface } from '../decorators/particle-source/particle-source-interface'
import { ParticleInterface } from '../decorators/particle/particle-interface'
import { SceneInterface } from '../decorators/scene'
import { SceneActionInterface } from '../decorators/scene/scene-action'
import { SceneStateInterface } from '../decorators/scene/scene-state'
import { SpriteInterface } from '../decorators/sprite'
import { TileMapInterface } from '../decorators/tilemap/tilemap-interface'

// 8a8f buscar los que no siguen .d.ts
export type ActorActionConstructor = new () => ActorActionInterface
export type ActorConstructor = new () => ActorInterface
export type ActorStateConstructor = new () => ActorStateInterface
export type AppConstructor = new () => AppInterface
export type CameraConstructor = new () => CameraInterface
export type GUIConstructor = new () => GUIInterface
export type MeshConstructor = new () => MeshInterface
export type MeshMapConstructor = new () => MeshMapInterface
export type MotionConstructor = new () => MotionInterface
export type ParticleConstructor = new () => ParticleInterface
export type ParticleSourceConstructor = new () => ParticleSourceInterface
export type SceneActionConstructor = new () => SceneActionInterface
export type SceneConstructor = new () => SceneInterface
export type TileMapConstructor = new () => TileMapInterface
export type SceneMapConstructor = MeshMapConstructor | TileMapConstructor
export type SceneStateConstructor = new () => SceneStateInterface
export type SpriteConstructor = new () => SpriteInterface
