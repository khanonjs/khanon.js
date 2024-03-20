import { SceneConfiguration } from '../../babylon-configurations'
import {
  ActorConstructor,
  CameraConstructor,
  SceneMapConstructor,
  StateConstructor
} from '../../constructors'

export interface SceneProps {
    cameras?: CameraConstructor[]
    maps?: SceneMapConstructor[]
    states?: StateConstructor[]
    actors?: ActorConstructor[]
    configuration?: SceneConfiguration
}
