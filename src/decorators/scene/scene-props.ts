import { SceneConfiguration } from '../../babylon-config'
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
