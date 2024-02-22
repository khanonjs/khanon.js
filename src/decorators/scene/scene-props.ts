import { ActorConstructor } from '../actor/actor-constructor'
import { CameraConstructor } from '../camera/camera-constructor'
import { StateConstructor } from '../state/state-constructor'
import { SceneConfiguration } from './scene-configuration'

export interface SceneProps {
    assets: any
    states: StateConstructor[]
    cameras: CameraConstructor[]
    actors: ActorConstructor[]
    configuration?: SceneConfiguration
}
