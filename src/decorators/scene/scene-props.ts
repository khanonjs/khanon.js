import { SceneConfiguration } from '../../babylon-configurations/scene-configuration'
import { ActorConstructor } from '../../constructors/actor-constructor'
import { CameraConstructor } from '../../constructors/camera-constructor'
import { SceneMapConstructor } from '../../constructors/scenemap-constructor'
import { StateConstructor } from '../../constructors/state-constructor'

export interface SceneProps {
    cameras?: CameraConstructor[]
    maps?: SceneMapConstructor[]
    states?: StateConstructor[]
    actors?: ActorConstructor[]
    configuration?: SceneConfiguration
}
