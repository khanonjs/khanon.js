import * as BABYLON from '@babylonjs/core'

import { InputEventProps } from '../../../decorators/input-event/input-event-props'
import { SceneInterface } from '../../../decorators/scene/scene-interface'

export interface MetadataInputEventDefinition {
  props: InputEventProps
  methodName: string
  observer?: BABYLON.Observer<any>
  argMethod?: (context: any, scene: SceneInterface | null) => any
}
