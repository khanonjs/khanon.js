import * as BABYLON from '@babylonjs/core'

import { SceneConfiguration } from '../../babylon-config'
import { ActorConstructor } from '../actor/actor-constructor'
import { CameraConstructor } from '../camera/camera-constructor'
import { MeshConstructor } from '../mesh/mesh-constructor'
import { SpriteConstructor } from '../sprite/sprite-constructor'
import { SceneActionConstructor } from './scene-action/scene-action-constructor'
import { SceneStateConstructor } from './scene-state/scene-state-constructor'

export interface SceneProps {
    options?: BABYLON.SceneOptions
    configuration?: SceneConfiguration
    // guis?: GUIConstructor[]
    cameras?: CameraConstructor[]
    // maps?: SceneMapConstructor[]
    states?: SceneStateConstructor[]
    actors?: ActorConstructor[]
    actions?: SceneActionConstructor[]
    sprites?: SpriteConstructor[]
    meshes?: MeshConstructor[]
}
