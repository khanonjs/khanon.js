import { SceneOptions } from '@babylonjs/core'

import { SceneConfiguration } from '../../babylon-config'
import {
  ActorConstructor,
  CameraConstructor,
  GUIConstructor,
  SceneEventConstructor,
  SceneMapConstructor,
  SceneStateConstructor
} from '../../constructors'

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
