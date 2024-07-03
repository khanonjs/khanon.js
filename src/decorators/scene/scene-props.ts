import { SceneOptions } from '@babylonjs/core'

import { SceneConfiguration } from '../../babylon-config'
import { ActorConstructor } from '../../constructors/actor-constructor'
import { CameraConstructor } from '../../constructors/camera-constructor'
import { GUIConstructor } from '../../constructors/gui-constructor'
import { SceneEventConstructor } from '../../constructors/scene-event-constructor'
import { SceneMapConstructor } from '../../constructors/scene-map-constructor'
import { SceneStateConstructor } from '../../constructors/scene-state-constructor'

export interface SceneProps {
    options?: SceneOptions
    configuration?: SceneConfiguration
    guis?: GUIConstructor[]
    cameras?: CameraConstructor[]
    maps?: SceneMapConstructor[]
    states?: SceneStateConstructor[]
    actors?: ActorConstructor[]
    events?: SceneEventConstructor[]
}
