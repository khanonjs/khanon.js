import { ActorConstructor } from '../actor/actor-constructor'
import { StateConstructor } from '../state/state-constructor'

export interface SceneProps {
    states: StateConstructor[]
    actors: ActorConstructor[]
    assets: any
}
