

import { SceneConfiguration } from '../../types/scene-configuration'
import { ActorConstructor } from '../actor/actor-constructor'
import { CameraConstructor } from '../camera/camera-constructor'
import { GUIConstructor } from '../gui/gui-constructor'
import { MeshConstructor } from '../mesh/mesh-constructor'
import { ParticleConstructor } from '../particle/particle-constructor'
import { SpriteConstructor } from '../sprite/sprite-constructor'
import { SceneActionConstructor } from './scene-action/scene-action-constructor'
import { SceneMapConstructor } from './scene-map-constructor'
import { SceneStateConstructor } from './scene-state/scene-state-constructor'

export interface SceneProps {
    url?: string
    options?: BABYLON.SceneOptions
    configuration?: SceneConfiguration
    guis?: GUIConstructor[]
    cameras?: CameraConstructor[]
    maps?: SceneMapConstructor[]
    states?: SceneStateConstructor[]
    actors?: ActorConstructor[]
    actions?: SceneActionConstructor[]
    sprites?: SpriteConstructor[]
    meshes?: MeshConstructor[]
    particles?: ParticleConstructor[]
    useDebugInspector?: boolean
}
