

import { InputEventProps } from '../../../decorators/input-event/input-event-props'

export interface MetadataInputEventDefinition {
  props: InputEventProps
  methodName: string
  observer?: BABYLON.Observer<any>
}
