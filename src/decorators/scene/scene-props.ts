import { ARGB } from '../../models/argb'
import { ActorConstructor } from '../actor/actor-constructor'
import { CameraConstructor } from '../camera/camera-constructor'
import { StateConstructor } from '../state/state-constructor'

export interface SceneProps {
    assets: any
    states: StateConstructor[]
    cameras: CameraConstructor[]
    actors: ActorConstructor[]
    clearColor?: ARGB
}
