import 'reflect-metadata' // TODO use reflect-metadata/lite?
// TODO remove lines depending wether it is debug or production bundle (webpack)
import '@babylonjs/inspector'
import '@babylonjs/core/Debug/debugLayer'
import '@babylonjs/loaders'

// Khanon.js
export { KJS } from './kjs/kjs'

// Actor decorator
export { Actor } from './decorators/actor/actor-decorator'
export { ActorInterface } from './decorators/actor/actor-interface'

// Actos Action
export { ActorAction } from './decorators/actor/actor-action/actor-action-decorator'
export { ActorActionInterface } from './decorators/actor/actor-action/actor-action-interface'

// Actos State
export { ActorState } from './decorators/actor/actor-state/actor-state-decorator'
export { ActorStateInterface } from './decorators/actor/actor-state/actor-state-interface'

// App decorator
export { App } from './decorators/app/app-decorator'
export { AppInterface } from './decorators/app/app-interface'

// App decorator
export { AppState } from './decorators/app/app-state/app-state-decorator'
export { AppStateInterface } from './decorators/app/app-state/app-state-interface'

// Camera decorator
export { Camera } from './decorators/camera/camera-decorator'
export { CameraInterface } from './decorators/camera/camera-interface'

// Camera decorator
export { CameraState } from './decorators/camera/camera-state/camera-state-decorator'
export { CameraStateInterface } from './decorators/camera/camera-state/camera-state-interface'

// Camera decorator
export { InputEvent } from './decorators/input-event/input-event-decorator'
export { InputEventProps } from './decorators/input-event/input-event-props'
export { InputEventIds } from './decorators/input-event/input-event-ids'

// GUI decorator
export { GUI } from './decorators/gui/gui-decorator'
export { GUIInterface } from './decorators/gui/gui-interface'

// GUI State decorator
export { GUIState } from './decorators/gui/gui-state/gui-state-decorator'
export { GUIStateInterface } from './decorators/gui/gui-state/gui-state-interface'

// Mesh decorator
export { Mesh } from './decorators/mesh/mesh-decorator'
export { MeshInterface } from './decorators/mesh/mesh-interface'

// Notification decorator
export { Notification } from './decorators/notification/notification-decorator'
export { NotificationProps } from './decorators/notification/notification-props'

// Particle decorator
export { Particle } from './decorators/particle/particle-decorator'
export { ParticleInterface } from './decorators/particle/particle-interface'

// Scene decorator
export { Scene } from './decorators/scene/scene-decorator'
export { SceneInterface } from './decorators/scene/scene-interface'

// Actos Action
export { SceneAction } from './decorators/scene/scene-action/scene-action-decorator'
export { SceneActionInterface } from './decorators/scene/scene-action/scene-action-interface'

// Scene State decorator
export { SceneState } from './decorators/scene/scene-state/scene-state-decorator'
export { SceneStateInterface } from './decorators/scene/scene-state/scene-state-interface'

// Sprite decorator
export { Sprite } from './decorators/sprite/sprite-decorator'
export { SpriteInterface } from './decorators/sprite/sprite-interface'

// Sound decorator
export { Sound } from './decorators/sound/sound-decorator'
export { SoundInterface } from './decorators/sound/sound-interface'

// Classes
export { LoadingProgress } from './base'

// Modules
export { Logger } from './modules/logger/logger'
export { LoggerLevels } from './modules/logger/logger-levels'
